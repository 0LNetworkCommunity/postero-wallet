import Emittery, { UnsubscribeFn } from "emittery";
import axios from 'axios';
import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import {
  IPendingTransaction,
  IPendingTransactionsRepository,
  IPendingTransactionsService,
  IPendingTransactionsUpdaterService,
  PendingTransactionStatus,
  PendingTransactionsUpdaterServiceEvent,
} from './interfaces';
import { Types } from '../../types';

@Injectable()
export class PendingTransactionsUpdaterService
  implements OnModuleInit, IPendingTransactionsUpdaterService
{
  private readonly updatingTransactions = new Set<string>();

  private eventEmitter = new Emittery();

  public constructor(
    @Inject(forwardRef(() => Types.IPendingTransactionsService))
    private readonly pendingTransactionsService: IPendingTransactionsService,

    @Inject(Types.IPendingTransactionsRepository)
    private readonly pendingTransactionsRepository: IPendingTransactionsRepository,
  ) {}

  public on(
    event: PendingTransactionsUpdaterServiceEvent,
    listener: (eventData: any) => void,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  public transactionUpdating(transaction: IPendingTransaction): boolean {
    return this.updatingTransactions.has(transaction.id);
  }

  public onModuleInit() {
    const tick = () => {
      this.checkDanglingTransactions()
        .catch((error) => console.error(error))
        .finally(() => {
          setTimeout(() => {
            tick();
          }, 10_000);
        });
    };

    setTimeout(() => {
      tick();
    }, 10_000);
  }

  private async checkDanglingTransactions() {
    const transactions =
      await this.pendingTransactionsRepository.getTransactionsExpiredAfter(
        Math.floor(Date.now() / 1e3),
        10,
      );

    for (const transaction of transactions) {
      await this.updateTransaction(transaction);
    }
  }

  public async updateTransaction(transaction: IPendingTransaction) {
    if (this.updatingTransactions.has(transaction.id)) {
      return;
    }

    if (!transaction.hash) {
      return;
    }

    this.updatingTransactions.add(transaction.id);
    this.eventEmitter.emit(
      PendingTransactionsUpdaterServiceEvent.UpdatingTransaction,
      transaction,
    );

    try {
      const res = await axios<{
        data?: {
          transaction: {
            hash: string;
            status: PendingTransactionStatus;
          };
        };
      }>({
        // url: 'http://localhost:3000/graphql',
        url: 'https://api.0l.fyi/graphql',
        method: 'POST',
        data: {
          operationName: 'GetTransaction',
          variables: {
            hash: Buffer.from(transaction.hash).toString('hex'),
          },
          query: `
            query GetTransaction($hash: Bytes!) {
              transaction(hash: $hash) {
                hash
                status
              }
            }
          `,
        },
      });

      if (res.data.data) {
        const { hash, status } = res.data.data.transaction;
        await this.pendingTransactionsService.setPendingTransactionStatus(
          Buffer.from(hash, 'hex'),
          status,
        );
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 4_000));

      this.updatingTransactions.delete(transaction.id);

      this.eventEmitter.emit(
        PendingTransactionsUpdaterServiceEvent.TransactionUpdated,
        transaction,
      );
    }
  }
}
