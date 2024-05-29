import { Inject, Injectable } from '@nestjs/common';
import { BN } from 'bn.js';
import { Decimal } from 'decimal.js';

import {
  IMovement,
  IMovementFactory,
  IMovementsRepository,
} from './interfaces';
import { IDbService } from '../../db/interfaces';
import { Types } from '../../types';
import { GenesisTransaction } from '../../wallets/transactions/GenesisTransaction';
import { BlockMetadataTransaction } from '../../wallets/transactions/BlockMetadataTransaction';
import { ScriptUserTransaction } from '../transactions/ScriptUserTransaction';
import { ITransactionsService } from '../transactions/interfaces';

@Injectable()
class MovementsRepository implements IMovementsRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IMovementFactory)
  private readonly movementFactory: IMovementFactory;

  @Inject(Types.ITransactionsService)
  private readonly transactionsService: ITransactionsService;

  public async getWalletMovements(
    walletAddress: Uint8Array,
  ): Promise<IMovement[]> {
    const rows: {
      version: string;
      lockedBalance: string;
      balance: string;
      lockedAmount: string;
      unlockedAmount: string;
    }[] = await this.dbService.db('movements').where({
      walletAddress: this.dbService.raw(walletAddress),
    });

    if (!rows.length) {
      return [];
    }

    const versions = rows.map((row) => row.version);

    const genesisTransactions = (
      await this.dbService.db('genesisTransaction').whereIn('version', versions)
    ).map(
      (row) =>
        new GenesisTransaction({
          version: row.version,
        }),
    );

    const userTransactions =
      await this.transactionsService.getUserTransactionsByVersion(versions);

    const scriptUserTransactions = (
      await this.dbService
        .db('scriptUserTransaction')
        .whereIn('version', versions)
    ).map(
      (row) =>
        new ScriptUserTransaction({
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
        new BlockMetadataTransaction({
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
