import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Emittery, { UnsubscribeFn } from 'emittery';

import {
  IPendingTransactionsRepository,
  ITransactionWatcher,
  ITransactionWatcherFactory,
  ITransactionsWatcherService,
  TransactionWatcherEvent,
  TransactionsWatcherServiceEvent,
} from './interfaces';
import { Types } from '../../types';
import { IWalletService } from '../interfaces';
import { AbstractTransaction } from './AbstractTransaction';
import { UserTransaction } from './UserTransaction';

@Injectable()
export class TransactionsWatcherService
  implements OnModuleInit, ITransactionsWatcherService
{
  private readonly eventEmitter = new Emittery();

  public constructor(
    @Inject(Types.IWalletService)
    private readonly walletService: IWalletService,

    @Inject(Types.ITransactionWatcherFactory)
    private readonly transactionWatcherFactory: ITransactionWatcherFactory,

    @Inject(Types.IPendingTransactionsRepository)
    private readonly pendingTransactionsRepository: IPendingTransactionsRepository,
  ) {}

  public async onModuleInit() {
    setTimeout(() => {
      this.init().catch((error) => {
        console.error('unable to init wallets watcher', error);
      });
    }, 1_000);
  }

  public on(
    event: TransactionsWatcherServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  private async init() {
    const wallets = await this.walletService.getWallets();

    const watchers = await Promise.all(
      wallets.map((wallet) =>
        this.transactionWatcherFactory.getWatcher(wallet.address),
      ),
    );

    for (const watcher of watchers) {
      watcher.on(TransactionWatcherEvent.PendingTransaction, (data) => {
        this.onPendingTransaction(watcher, data);
      });

      watcher.on(TransactionWatcherEvent.Transaction, (transaction) => {
        try {
          this.onTransaction(watcher, transaction);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }

  private onPendingTransaction(
    watcher: ITransactionWatcher,
    { hash, status }: { hash: Uint8Array; status: string },
  ) {
    this.eventEmitter.emit(TransactionsWatcherServiceEvent.PendingTransaction, {
      adddress: watcher.address,
      hash,
      status,
    });
  }

  private async onTransaction(
    watcher: ITransactionWatcher,
    transaction: AbstractTransaction,
  ) {
    if (transaction instanceof UserTransaction) {
      const pendingTransaction =
        await this.pendingTransactionsRepository.getPendingTransactionByHash(
          transaction.hash,
        );
      if (pendingTransaction) {
        this.eventEmitter.emit(
          TransactionsWatcherServiceEvent.PendingTransaction,
          {
            adddress: watcher.address,
            hash: pendingTransaction.hash,
            status: pendingTransaction.status,
          },
        );
      }
    }
  }
}
