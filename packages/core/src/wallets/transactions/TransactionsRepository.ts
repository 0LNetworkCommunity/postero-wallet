import { Inject, Injectable } from '@nestjs/common';

import { ITransactionFactory, ITransactionsRepository, IUserTransaction } from './interfaces';
import { IDbService } from '../../db/interfaces';
import { Types } from '../../types';
import { AbstractTransaction } from './AbstractTransaction';
import { BN } from 'bn.js';

@Injectable()
class TransactionsRepository implements ITransactionsRepository {
  public constructor(
    @Inject(Types.IDbService)
    private dbService: IDbService,

    @Inject(Types.ITransactionFactory)
    private transactionFactory: ITransactionFactory,
  ) {}

  public async getTransactionByHash(
    hash: Uint8Array,
  ): Promise<AbstractTransaction | null> {
    const userTransaction = await this.getUserTransactionByHash(hash);
    if (userTransaction) {
      return userTransaction;
    }
    return null;
  }

  public async getUserTransactionByHash(
    hash: Uint8Array,
  ): Promise<IUserTransaction | null> {
    const userTransaction = await this.dbService
      .db('userTransaction')
      .where('hash', this.dbService.raw(hash))
      .first();
    if (userTransaction) {
      return this.transactionFactory.createUserTransaction(userTransaction);
    }
    return null;
  }

  public async getUserTransactionsByVersion(
    versions: string[],
  ): Promise<IUserTransaction[]> {
    const rows = await this.dbService
      .db('userTransaction')
      .whereIn('version', versions);

    const userTransactions = await Promise.all(
      rows.map((row) => this.transactionFactory.createUserTransaction(row)),
    );
    return userTransactions;
  }

  public async createUserTransactions(
    rawTransactions: {
      version: string;
      timestamp: string;
      success: boolean;
      sender: Uint8Array;
      hash: Uint8Array;
      moduleAddress: Uint8Array;
      moduleName: string;
      functionName: string;
      arguments: string;
    }[],
  ): Promise<IUserTransaction[]> {
    if (!rawTransactions.length) {
      return [];
    }

    const rows = rawTransactions.map((transaction) => ({
      version: transaction.version,
      success: transaction.success,
      hash: this.dbService.raw(transaction.hash),
      sender: this.dbService.raw(transaction.sender),
      moduleAddress: this.dbService.raw(transaction.moduleAddress),
      moduleName: transaction.moduleName,
      functionName: transaction.functionName,
      arguments: transaction.arguments,
      timestamp: transaction.timestamp,
    }));

    const res = await this.dbService
      .db('userTransaction')
      .insert(rows)
      .returning<
        {
          version: string;
          success: number;
          sender: Uint8Array;
          hash: Uint8Array;
          moduleAddress: Uint8Array;
          moduleName: string;
          functionName: string;
          arguments: string;
          timestamp: number;
        }[]
      >('*')
      .onConflict('version')
      .ignore();

    return Promise.all(
      res.map((it) => {
        return this.transactionFactory.createUserTransaction({
          version: new BN(it.version),
          success: !!it.success,
          timestamp: new BN(it.timestamp),
          sender: it.sender,
          hash: it.hash,
          moduleAddress: it.moduleAddress,
          moduleName: it.moduleName,
          functionName: it.functionName,
          arguments: it.arguments,
        });
      }),
    );
  }
}

export default TransactionsRepository;
