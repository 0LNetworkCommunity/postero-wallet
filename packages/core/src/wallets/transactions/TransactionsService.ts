import { Inject, Injectable } from '@nestjs/common';

import {
  ITransactionsRepository,
  ITransactionsService,
  IUserTransaction,
  RawUserTransaction,
} from './interfaces';
import { Types } from '../../types';

@Injectable()
class TransactionsService implements ITransactionsService {
  public constructor(
    @Inject(Types.ITransactionsRepository)
    private readonly transactionsRepository: ITransactionsRepository,
  ) {}

  public getUserTransactionsByVersion(
    versions: string[],
  ): Promise<IUserTransaction[]> {
    return this.transactionsRepository.getUserTransactionsByVersion(versions);
  }

  public createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]> {
    return this.transactionsRepository.createUserTransactions(rawTransactions);
  }
}

export default TransactionsService;
