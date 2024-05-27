import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  IPendingTransaction,
  IPendingTransactionFactory,
  PendingTransactionArgs,
} from './interfaces';
import { Types } from '../types';

@Injectable()
class PendingTransactionFactory implements IPendingTransactionFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getPendingTransaction(
    args: PendingTransactionArgs,
  ): Promise<IPendingTransaction> {
    const pendingTransaction =
      await this.moduleRef.resolve<IPendingTransaction>(
        Types.IPendingTransaction,
      );
    pendingTransaction.init(args);
    return pendingTransaction;
  }
}

export default PendingTransactionFactory;
