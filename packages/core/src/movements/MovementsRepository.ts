import { Inject, Injectable } from '@nestjs/common';
import { BN } from 'bn.js';
import { Decimal } from 'decimal.js';

import {
  IMovement,
  IMovementFactory,
  IMovementsRepository,
} from './interfaces';
import { IDbService } from '../db/interfaces';
import { Types } from '../types';
import { GqlGenesisTransaction } from './GenesisTransaction';
import { GqlUserTransaction } from './UserTransaction';
import { GqlBlockMetadataTransaction } from './BlockMetadataTransaction';
import { GqlScriptUserTransaction } from './ScriptUserTransaction';

@Injectable()
class MovementsRepository implements IMovementsRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IMovementFactory)
  private readonly movementFactory: IMovementFactory;

  public async getWalletMovements(walletId: string): Promise<IMovement[]> {
    const rows: {
      version: string;
      lockedBalance: string;
      balance: string;
      lockedAmount: string;
      unlockedAmount: string;
    }[] = await this.dbService.db('movements').where({ walletId });

    if (!rows.length) {
      return [];
    }

    const versions = rows.map((row) => row.version);

    const genesisTransactions = (
      await this.dbService.db('genesisTransaction').whereIn('version', versions)
    ).map(
      (row) =>
        new GqlGenesisTransaction({
          version: row.version,
        }),
    );

    const userTransactions = (
      await this.dbService.db('userTransaction').whereIn('version', versions)
    ).map(
      (row) =>
        new GqlUserTransaction({
          version: row.version,
          timestamp: new BN(row.timestamp),
          success: row.success,
          moduleAddress: row.moduleAddress,
          moduleName: row.moduleName,
          functionName: row.functionName,
          sender: row.sender,
          arguments: row.arguments,
        }),
    );

    const scriptUserTransactions = (
      await this.dbService.db('scriptUserTransaction').whereIn('version', versions)
    ).map(
      (row) =>
        new GqlScriptUserTransaction({
          version: row.version,
          timestamp: new BN(row.timestamp),
          success: row.success,
          sender: row.sender,
        }),
    );

    const blockMetadataTransactions = (
      await this.dbService
        .db('blockMetadataTransaction')
        .whereIn('version', versions)
    ).map(
      (row) =>
        new GqlBlockMetadataTransaction({
          version: row.version,
          timestamp: new BN(row.timestamp),
          epoch: row.epoch,
        }),
    );

    const transactionsMap = new Map(
      [
        ...genesisTransactions,
        ...userTransactions,
        ...blockMetadataTransactions,
        ...scriptUserTransactions,
      ].map((transaction) => [transaction.version.toString(), transaction]),
    );

    const movements = await Promise.all(
      rows.map((row) =>
        this.movementFactory.createMovement({
          version: new BN(row.version),
          transaction: transactionsMap.get(row.version)!,
          lockedAmount: new Decimal(row.lockedAmount),
          unlockedAmount: new Decimal(row.unlockedAmount),
          balance: new Decimal(row.balance),
          lockedBalance: new Decimal(row.lockedBalance),
        }),
      ),
    );

    movements.sort((a, b) => {
      if (a.version.lt(b.version)) {
        return 1;
      }

      if (a.version.gt(b.version)) {
        return -1;
      }

      return 0;
    });

    return movements;
  }
}

export default MovementsRepository;
