import { Inject, Injectable } from '@nestjs/common';
import BN from 'bn.js';

import {
  ITransactionsRepository,
  ITransactionsService,
  RawUserTransaction,
} from './interfaces';
import { Types } from '../../types';
import { AbstractTransaction } from './AbstractTransaction';
import { IUserTransaction } from './UserTransaction';

@Injectable()
class TransactionsService implements ITransactionsService {
  public constructor(
    @Inject(Types.ITransactionsRepository)
    private readonly transactionsRepository: ITransactionsRepository,
  ) {}

  public getUserTransactionsByVersion(
    versions: BN[],
  ): Promise<IUserTransaction[]> {
    return this.transactionsRepository.getUserTransactionsByVersions(versions);
  }

  public createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]> {
    return this.transactionsRepository.createUserTransactions(rawTransactions);
  }

  public async getTransactionsByVersions(
    versions: BN[],
  ): Promise<AbstractTransaction[]> {
    return this.transactionsRepository.getTransactionsByVersions(versions);
  }
}

export default TransactionsService;
