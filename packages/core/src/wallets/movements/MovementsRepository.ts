import { Inject, Injectable } from '@nestjs/common';
import BN from 'bn.js';
import { Decimal } from 'decimal.js';

import {
  IMovement,
  IMovementFactory,
  IMovementsRepository,
  OnChainTransaction,
} from './interfaces';
import { IDbService } from '../../db/interfaces';
import { Types } from '../../types';
import { ITransactionFactory, ITransactionsService } from '../transactions/interfaces';

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

    const versions = rows.map((row) => new BN(row.version));
    const transactions = await this.transactionsService.getTransactionsByVersions(versions);

    const transactionsMap = new Map(
      transactions.map((transaction) => {
        const tx = transaction as OnChainTransaction;
        return [tx.version.toString(), transaction];
      }),
    );

    const movements = await Promise.all(
      rows.map(async (row) => {
        const movement = await this.movementFactory.createMovement({
          version: new BN(row.version),
          transaction: transactionsMap.get(row.version)!,
          lockedAmount: new Decimal(row.lockedAmount),
          unlockedAmount: new Decimal(row.unlockedAmount),
          balance: new Decimal(row.balance),
          lockedBalance: new Decimal(row.lockedBalance),
        });
        return movement;
      }),
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
