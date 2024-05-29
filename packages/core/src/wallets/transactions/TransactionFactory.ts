import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  ITransactionFactory,
  IUserTransaction,
  UserTransactionInput,
} from './interfaces';
import { Types } from '../../types';

@Injectable()
export class TransactionFactory implements ITransactionFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createUserTransaction(
    args: UserTransactionInput,
  ): Promise<IUserTransaction> {
    const userTransaction = await this.moduleRef.resolve<IUserTransaction>(
      Types.IUserTransaction,
    );
    userTransaction.init(args);
    return userTransaction;
  }
}
