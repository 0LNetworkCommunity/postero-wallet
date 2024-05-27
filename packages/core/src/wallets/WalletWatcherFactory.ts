import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';

import { IWalletWatcher, IWalletWatcherFactory } from './interfaces';
import { Types } from '../types';

@Injectable()
export class WalletWatcherFactory implements IWalletWatcherFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getWatcher(address: Uint8Array): Promise<IWalletWatcher> {
    const watcher = await this.moduleRef.resolve<IWalletWatcher>(
      Types.IWalletWatcher,
    );
    watcher.init(address);
    return watcher;
  }
}
