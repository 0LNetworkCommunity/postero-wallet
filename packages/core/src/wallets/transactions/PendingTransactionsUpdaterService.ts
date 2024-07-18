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
import BN from "bn.js";

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
    return this.updatingTransactions.has(
      Buffer.from(transaction.hash).toString('hex'),
    );
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
    if (
      this.updatingTransactions.has(
        Buffer.from(transaction.hash).toString('hex'),
      )
    ) {
      return;
    }

    if (!transaction.hash) {
      return;
    }

    this.updatingTransactions.add(
      Buffer.from(transaction.hash).toString('hex'),
    );
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
      } else {
        const info = await this.getInfo();

        if (info.latestStableTimestamp) {
          const expirationTimestamp = new BN(transaction.expirationTimestamp).mul(new BN(1e3));
          if (info.latestStableTimestamp.gt(expirationTimestamp)) {
            await this.pendingTransactionsService.setPendingTransactionStatus(
              transaction.hash,
              PendingTransactionStatus.Expired,
            );
          }
        }
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 4_000));

      this.updatingTransactions.delete(
        Buffer.from(transaction.hash).toString('hex'),
      );

      this.eventEmitter.emit(
        PendingTransactionsUpdaterServiceEvent.TransactionUpdated,
        transaction,
      );
    }
  }

  private async getInfo(): Promise<{
    latestStableVersion: BN | null;
    latestStableTimestamp: BN | null;
  }> {
    const res = await axios<{
      data?: {
        info: {
          latestStableVersion: string | null;
          latestStableTimestamp: string | null;
        };
      };
    }>({
      url: 'https://api.0l.fyi/graphql',
      method: 'POST',
      data: {
        operationName: 'GetInfo',
        query: `
          query GetInfo {
            info {
              latestStableVersion
              latestStableTimestamp
            }
          }
        `,
      },
    });

    if (res.data.data) {
      return {
        latestStableVersion:
          res.data.data.info.latestStableVersion
            ? new BN(res.data.data.info.latestStableVersion)
            : null,
        latestStableTimestamp:
          res.data.data.info.latestStableTimestamp
            ? new BN(res.data.data.info.latestStableTimestamp)
            : null,
      };
    }

    throw new Error('unable to retreive info');
  }
}
