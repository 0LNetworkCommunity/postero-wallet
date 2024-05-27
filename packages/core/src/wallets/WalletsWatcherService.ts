import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Emittery, { UnsubscribeFn } from 'emittery';

import {
  IWalletService,
  IWalletWatcher,
  IWalletWatcherFactory,
  IWalletsWatcherService,
  WalletWatcherEvent,
  WalletsWatcherServiceEvent,
} from './interfaces';
import { Types } from '../types';

@Injectable()
export class WalletsWatcherService
  implements OnModuleInit, IWalletsWatcherService
{
  private readonly eventEmitter = new Emittery();

  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IWalletWatcherFactory)
  private readonly walletWatcherFactory!: IWalletWatcherFactory;

  public async onModuleInit() {
    setTimeout(() => {
      this.init().catch((error) => {
        console.error('unable to init wallets watcher', error);
      });
    }, 1_000);
  }

  public on(
    event: WalletsWatcherServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  private async init() {
    const wallets = await this.walletService.getWallets();

    const watchers = await Promise.all(
      wallets.map((wallet) =>
        this.walletWatcherFactory.getWatcher(wallet.address),
      ),
    );

    for (const watcher of watchers) {
      watcher.on(WalletWatcherEvent.PendingTransaction, (data) =>
        this.onPendingTransaction(watcher, data),
      );
    }
  }

  private onPendingTransaction(
    watcher: IWalletWatcher,
    { hash, status }: { hash: Uint8Array; status: string },
  ) {
    this.eventEmitter.emit(WalletsWatcherServiceEvent.PendingTransaction, {
      adddress: watcher.address,
      hash,
      status,
    });
  }
}
