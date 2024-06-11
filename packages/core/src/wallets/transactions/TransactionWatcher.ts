import { Inject, Injectable } from '@nestjs/common';
import Emittery, { UnsubscribeFn } from 'emittery';
import { Repeater } from '@repeaterjs/repeater';

import {
  IPendingTransactionsRepository,
  ITransactionWatcher,
  ITransactionsRepository,
  PendingTransactionStatus,
  TransactionWatcherEvent,
} from './interfaces';
import { Types } from '../../types';
import { IOlFyiService } from '../../ol-fyi/interfaces';
import { parseHexString } from '../../utils';

interface RawTransaction {
  hash: string;
  status: string;
  onChainTransaction:
    | undefined
    | {
        __typename: 'UserTransaction';
        version: string;
        success: boolean;
        moduleName: string;
        moduleAddress: string;
        functionName: string;
        sender: string;
        hash: string;
        arguments: string;
        timestamp: string;
      };
}

@Injectable()
export class TransactionWatcher implements ITransactionWatcher {
  public address: Uint8Array;

  private destroyPromise: Promise<void>;

  private resolveDestroyPromise: () => void;

  private readonly eventEmitter = new Emittery();

  public constructor(
    @Inject(Types.IOlFyiService)
    private readonly olFyiService: IOlFyiService,

    @Inject(Types.ITransactionsRepository)
    private readonly transactionsRepository: ITransactionsRepository,

    @Inject(Types.IPendingTransactionsRepository)
    private readonly pendingTransactionsRepository: IPendingTransactionsRepository,
  ) {
    this.destroyPromise = new Promise<void>((resolve) => {
      this.resolveDestroyPromise = resolve;
    });
  }

  public init(address: Uint8Array): void {
    this.address = address;

    setTimeout(() => {
      this.initWatcher().catch((error) => {
        console.error('unable to init wallet watcher', error);
      });
    }, 1_000);
  }

  public async destroy(): Promise<void> {
    this.resolveDestroyPromise();
  }

  public on(
    event: TransactionWatcherEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  private async initWatcher() {
    const walletTransactionSubscription = this.olFyiService.wsGraphql.iterate<{
      walletTransaction: RawTransaction;
    }>({
      query: `
        subscription WalletTransaction($address: Bytes!){
          walletTransaction(address: $address) {
            hash
            status
            onChainTransaction {
              __typename
              version
              ... on UserTransaction {
                success
                moduleName
                moduleAddress
                functionName
                sender
                hash
                arguments
                timestamp
              }
            }
          }
        }
      `,
      variables: {
        address: Buffer.from(this.address).toString('hex'),
      },
    });

    for await (const value of Repeater.race([
      walletTransactionSubscription,
      this.destroyPromise,
    ])) {
      if (!value) {
        return;
      }

      if (value.data) {
        await this.processRawTransaction(value.data.walletTransaction);
      }
    }
  }

  private async processRawTransaction(rawTransaction: RawTransaction) {
    const hash = parseHexString(rawTransaction.hash);

    const pendingTransaction =
      await this.pendingTransactionsRepository.getPendingTransactionByHash(
        hash,
      );
    if (pendingTransaction) {
      await this.pendingTransactionsRepository.setPendingTransactionStatus(
        pendingTransaction.id,
        rawTransaction.status as PendingTransactionStatus,
      );
    }

    const { onChainTransaction } = rawTransaction;
    if (onChainTransaction) {
      if (onChainTransaction.__typename === 'UserTransaction') {
        const userTransactions =
          await this.transactionsRepository.createUserTransactions([
            {
              version: onChainTransaction.version,
              success: onChainTransaction.success,
              moduleName: onChainTransaction.moduleName,
              moduleAddress: parseHexString(onChainTransaction.moduleAddress),
              functionName: onChainTransaction.functionName,
              sender: parseHexString(onChainTransaction.sender),
              hash: parseHexString(onChainTransaction.hash),
              arguments: onChainTransaction.arguments,
              timestamp: onChainTransaction.timestamp,
            },
          ]);

        for (const userTransaction of userTransactions) {
          this.eventEmitter.emit(
            TransactionWatcherEvent.Transaction,
            userTransaction,
          );
        }
      }
    }

    this.eventEmitter.emit(TransactionWatcherEvent.PendingTransaction, {
      hash,
      status: rawTransaction.status,
    });
  }
}
