import { Inject, Injectable } from "@nestjs/common";

import {
  IPendingTransaction,
  IPendingTransactionFactory,
  IPendingTransactionsRepository,
  PendingTransactionStatus,
  RawPendingTransactionPayloadType,
} from "./interfaces";
import { Types } from "../../types";
import { IDbService } from "../../db/interfaces";
import { PlatformTypes } from "../../platform/platform-types";
import { PlatformCryptoService } from "../../platform/interfaces";

@Injectable()
class PendingTransactionsRepository implements IPendingTransactionsRepository {
  @Inject(Types.IDbService)
  private dbService: IDbService;

  @Inject(Types.IPendingTransactionFactory)
  private pendingTransactionFactory: IPendingTransactionFactory;

  @Inject(PlatformTypes.CryptoService)
  private readonly platformCryptoService: PlatformCryptoService;

  public async createPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<string> {
    const id = this.platformCryptoService.randomUUID();
    const createdAt = new Date();

    await this.dbService.db('pendingTransactions').insert({
      id,
      sender: this.dbService.raw(sender),
      payload: this.dbService.raw(transactionPayload),
      maxGasUnit: maxGasUnit.toString(10),
      gasPrice: gasPrice.toString(10),
      expirationTimestamp: expirationTimestamp.toString(10),
      createdAt: createdAt.toISOString(),
      status: PendingTransactionStatus.Unknown,
    });

    return id;
  }

  public async getPendingTransaction(
    id: string,
  ): Promise<IPendingTransaction | null> {
    const row = await this.dbService
      .db('pendingTransactions')
      .where('id', id)
      .first();
    if (!row) {
      return null;
    }

    return this.pendingTransactionFactory.getPendingTransaction({
      id: row.id,
      hash: row.hash,
      status: row.status,
      type: row.type as RawPendingTransactionPayloadType,
      payload: row.payload,
      createdAt: new Date(row.createdAt),
      expirationTimestamp: row.expirationTimestamp,
    });
  }

  public async getPendingTransactionByHash(
    hash: Uint8Array,
  ): Promise<IPendingTransaction | null> {
    /**
     * This throws an exception:
     * Exception in HostFunction: unordered_map::at: key not found
     * Using a raw query for lack of a better solution
     */
    // const row = await this.dbService
    //   .db('pendingTransactions')
    //   .where('hash', hash)
    //   .first();

    const rows = await this.dbService.raw(`
      SELECT *
      FROM "pendingTransactions"
      WHERE
        "hash" = X'${Buffer.from(hash).toString('hex')}'
      LIMIT 1
    `);

    const row = rows[0];
    if (!row) {
      return null;
    }

    return this.pendingTransactionFactory.getPendingTransaction({
      id: row.id,
      hash: row.hash,
      status: row.status,
      type: row.type as RawPendingTransactionPayloadType,
      payload: row.payload,
      createdAt: new Date(row.createdAt),
      expirationTimestamp: row.expirationTimestamp,
    });
  }

  public async getPendingTransactions(): Promise<IPendingTransaction[]> {
    const rows = await this.dbService.db('pendingTransactions');

    return Promise.all(
      rows.map((row) =>
        this.pendingTransactionFactory.getPendingTransaction({
          id: row.id,
          hash: row.hash,
          status: row.status,
          type: row.type as RawPendingTransactionPayloadType,
          payload: row.payload,
          createdAt: new Date(row.createdAt),
          expirationTimestamp: row.expirationTimestamp,
        }),
      ),
    );
  }

  public async removePendingTransaction(id: string): Promise<void> {
    await this.dbService.db('pendingTransactions').where('id', id).del();
  }

  public async setPendingTransactionHash(
    id: string,
    hash: Uint8Array,
  ): Promise<void> {
    await this.dbService
      .db('pendingTransactions')
      .update({
        hash,
      })
      .where('id', id);
  }

  public async setPendingTransactionStatus(
    id: string,
    status: PendingTransactionStatus,
  ): Promise<void> {
    await this.dbService
      .db('pendingTransactions')
      .update({
        status,
      })
      .where('id', id);
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
          id: transaction.id,
          hash: transaction.hash,
          status: transaction.status,
          type: transaction.type as RawPendingTransactionPayloadType,
          payload: transaction.payload,
          createdAt: new Date(transaction.createdAt),
          expirationTimestamp: transaction.expirationTimestamp,
        }),
      ),
    );
  }
}

export default PendingTransactionsRepository;
