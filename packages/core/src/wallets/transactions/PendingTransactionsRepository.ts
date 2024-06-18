import { Inject, Injectable } from '@nestjs/common';
import { sha3_256 as sha3Hash } from '@noble/hashes/sha3';

import {
  IPendingTransaction,
  IPendingTransactionFactory,
  IPendingTransactionsRepository,
  PendingTransactionStatus,
} from './interfaces';
import { Types } from '../../types';
import { IDbService } from '../../db/interfaces';

function getTransactionHash(signedTransaction: Uint8Array): Uint8Array {
  const txHash = sha3Hash
    .create()
    .update(sha3Hash.create().update('DIEM::Transaction').digest())
    .update(new Uint8Array([0]))
    .update(signedTransaction)
    .digest();
  return txHash;
}

@Injectable()
class PendingTransactionsRepository implements IPendingTransactionsRepository {
  @Inject(Types.IDbService)
  private dbService: IDbService;

  @Inject(Types.IPendingTransactionFactory)
  private pendingTransactionFactory: IPendingTransactionFactory;

  public async createPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<Uint8Array> {
    const createdAt = new Date();
    const hash = getTransactionHash(transactionPayload);

    await this.dbService.db('pendingTransactions').insert({
      hash: this.dbService.raw(hash),
      sender: this.dbService.raw(sender),
      payload: this.dbService.raw(transactionPayload),
      maxGasUnit: maxGasUnit.toString(10),
      gasPrice: gasPrice.toString(10),
      expirationTimestamp: expirationTimestamp.toString(10),
      createdAt: createdAt.toISOString(),
      status: PendingTransactionStatus.Unknown,
    });

    return hash;
  }

  public async getPendingTransaction(
    hash: Uint8Array,
  ): Promise<IPendingTransaction | null> {
    const row = await this.dbService
      .db('pendingTransactions')
      .where('hash', this.dbService.raw(hash))
      .first();
    if (!row) {
      return null;
    }

    return this.pendingTransactionFactory.getPendingTransaction({
      hash: row.hash,
      status: row.status,
      payload: row.payload,
      createdAt: new Date(row.createdAt),
      expirationTimestamp: row.expirationTimestamp,
    });
  }

  public async getWalletPendingTransactions(
    address: Uint8Array,
  ): Promise<IPendingTransaction[]> {
    const rows = await this.dbService
      .db('pendingTransactions')
      .where('sender', this.dbService.raw(address))
      .orderBy('createdAt', 'desc');

    return Promise.all(
      rows.map((row) =>
        this.pendingTransactionFactory.getPendingTransaction({
          hash: row.hash,
          status: row.status,
          payload: row.payload,
          createdAt: new Date(row.createdAt),
          expirationTimestamp: row.expirationTimestamp,
        }),
      ),
    );
  }

  public async getPendingTransactions(): Promise<IPendingTransaction[]> {
    const rows = await this.dbService
      .db('pendingTransactions')
      .orderBy('createdAt', 'desc');

    return Promise.all(
      rows.map((row) =>
        this.pendingTransactionFactory.getPendingTransaction({
          hash: row.hash,
          status: row.status,
          payload: row.payload,
          createdAt: new Date(row.createdAt),
          expirationTimestamp: row.expirationTimestamp,
        }),
      ),
    );
  }

  public async removePendingTransaction(hash: Uint8Array): Promise<void> {
    await this.dbService
      .db('pendingTransactions')
      .where('hash', this.dbService.raw(hash))
      .del();
  }

  public async setPendingTransactionStatus(
    hash: Uint8Array,
    status: PendingTransactionStatus,
  ): Promise<void> {
    await this.dbService
      .db('pendingTransactions')
      .update({
        status,
      })
      .where('hash', hash);
  }

  public async getTransactionsExpiredAfter(
    timestamp: number,
    limit: number,
  ): Promise<IPendingTransaction[]> {
    const transactions = await this.dbService
      .db('pendingTransactions')
      .where('status', PendingTransactionStatus.Unknown)
      .where('expirationTimestamp', '<', timestamp)
      .limit(limit);

    return Promise.all(
      transactions.map((transaction) =>
        this.pendingTransactionFactory.getPendingTransaction({
          hash: transaction.hash,
          status: transaction.status,
          payload: transaction.payload,
          createdAt: new Date(transaction.createdAt),
          expirationTimestamp: transaction.expirationTimestamp,
        }),
      ),
    );
  }
}

export default PendingTransactionsRepository;
