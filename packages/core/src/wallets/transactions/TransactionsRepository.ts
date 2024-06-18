import { Inject, Injectable } from '@nestjs/common';

import { IPendingTransactionsRepository, ITransactionFactory, ITransactionsRepository } from './interfaces';
import { IDbService } from '../../db/interfaces';
import { Types } from '../../types';
import { AbstractTransaction } from './AbstractTransaction';
import BN from 'bn.js';
import { IBlockMetadataTransaction } from './BlockMetadataTransaction';
import { IGenesisTransaction } from './GenesisTransaction';
import { IScriptUserTransaction } from './ScriptUserTransaction';
import { IUserTransaction } from './UserTransaction';

@Injectable()
class TransactionsRepository implements ITransactionsRepository {
  public constructor(
    @Inject(Types.IDbService)
    private dbService: IDbService,

    @Inject(Types.ITransactionFactory)
    private transactionFactory: ITransactionFactory,

    @Inject(Types.IPendingTransactionsRepository)
    private pendingTransactionsRepository: IPendingTransactionsRepository,
  ) {}

  public async getTransactionByVersion(
    version: BN,
  ): Promise<AbstractTransaction | null> {
    return null;
  }

  public async getTransactionByHash(
    hash: Uint8Array,
  ): Promise<AbstractTransaction | null> {
    const pendingTransaction =
      await this.pendingTransactionsRepository.getPendingTransaction(
        hash,
      );
    if (pendingTransaction) {
      return pendingTransaction;
    }

    const userTransaction = await this.getUserTransactionByHash(hash);
    if (userTransaction) {
      return userTransaction;
    }

    const genesisTransaction = await this.getGenesisTransactionByHash(hash);
    if (genesisTransaction) {
      return genesisTransaction;
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

  public async getUserTransactionsByVersions(
    versions: BN[],
  ): Promise<IUserTransaction[]> {
    const rows = await this.dbService.db('userTransaction').whereIn(
      'version',
      versions.map((version) => version.toString()),
    );

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

  private async getGenesisTransactionByHash(
    hash: Uint8Array,
  ): Promise<IGenesisTransaction | null> {
    const genesisTransaction = await this.dbService
      .db<{ version: string; hash: Uint8Array }>('genesisTransaction')
      .where('hash', this.dbService.raw(hash))
      .first();
    if (genesisTransaction) {
      return this.transactionFactory.createGenesisTransaction({
        version: new BN(genesisTransaction.version),
        hash: genesisTransaction.hash,
      });
    }
    return null;
  }

  public async getGenesisTransactionByVersion(
    version: BN,
  ): Promise<IGenesisTransaction | null> {
    const genesisTransaction = await this.dbService
      .db('genesisTransaction')
      .where('version', version.toString())
      .first();

    return null;
  }

  public async getGenesisTransactionsByVersions(
    versions: BN[],
  ): Promise<IGenesisTransaction[]> {
    const rows = await this.dbService
      .db<{
        version: string;
        hash: Uint8Array;
      }>('genesisTransaction')
      .whereIn(
        'version',
        versions.map((version) => version.toString()),
      );
    return Promise.all(
      rows.map((row) =>
        this.transactionFactory.createGenesisTransaction({
          version: new BN(row.version),
          hash: row.hash,
        }),
      ),
    );
  }

  public async getScriptUserTransactionsByVersions(
    versions: BN[],
  ): Promise<IScriptUserTransaction[]> {
    const rows = await this.dbService
      .db<{
        version: string;
        hash: Uint8Array;
        timestamp: string;
        sender: Uint8Array;
        success: number;
      }>('scriptUserTransaction')
      .whereIn(
        'version',
        versions.map((version) => version.toString()),
      );

    const scriptUserTransactions = await Promise.all(
      rows.map((row) =>
        this.transactionFactory.createScriptUserTransaction({
          hash: row.hash,
          version: new BN(row.version),
          timestamp: new BN(row.timestamp),
          success: row.success === 1,
          sender: row.sender,
        }),
      ),
    );

    return scriptUserTransactions;
  }

  public async getBlockMetadataTransactionsByVersions(
    versions: BN[],
  ): Promise<IBlockMetadataTransaction[]> {
    const rows = await this.dbService
      .db<{
        version: string;
        timestamp: string;
        epoch: number;
        hash: Uint8Array;
      }>('blockMetadataTransaction')
      .whereIn(
        'version',
        versions.map((version) => version.toString()),
      );
    return Promise.all(
      rows.map((row) =>
        this.transactionFactory.createBlockMetadataTransaction({
          version: new BN(row.version),
          timestamp: new BN(row.timestamp),
          epoch: new BN(row.epoch),
          hash: row.hash,
        }),
      ),
    );
  }

  public async getTransactionsByVersions(
    versions: BN[],
  ): Promise<AbstractTransaction[]> {
    const [
      genesisTransactions,
      userTransactions,
      scriptUserTransactions,
      blockMetadataTransactions,
    ] = await Promise.all([
      this.getGenesisTransactionsByVersions(versions),
      this.getUserTransactionsByVersions(versions),
      this.getScriptUserTransactionsByVersions(versions),
      this.getBlockMetadataTransactionsByVersions(versions),
    ]);

    return [
      ...genesisTransactions,
      ...userTransactions,
      ...scriptUserTransactions,
      ...blockMetadataTransactions,
    ];
  }
}

export default TransactionsRepository;
