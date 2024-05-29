import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';

import { ITransactionWatcher, ITransactionWatcherFactory } from './interfaces';
import { Types } from '../../types';

@Injectable()
export class TransactionWatcherFactory implements ITransactionWatcherFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getWatcher(address: Uint8Array): Promise<ITransactionWatcher> {
    const watcher = await this.moduleRef.resolve<ITransactionWatcher>(
      Types.ITransactionWatcher,
    );
    watcher.init(address);
    return watcher;
  }
}
