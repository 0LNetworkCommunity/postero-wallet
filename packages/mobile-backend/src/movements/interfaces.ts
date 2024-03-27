import BN from 'bn.js';
import { Decimal } from 'decimal.js';
import { GqlAbstractTransaction } from './AbstractTransaction';
import { GqlMovementInput } from './Movement';

export interface IMovement {
  version: BN;
  transaction: GqlAbstractTransaction;

  unlockedAmount: Decimal;
  lockedAmount: Decimal;

  balance: Decimal;
  lockedBalance: Decimal;

  init(input: GqlMovementInput): void;
}

export interface IMovementsService {
  getWalletMovements(walletId: string): Promise<IMovement[]>;
}

export interface IMovementFactory {
  createMovement(input: GqlMovementInput): Promise<IMovement>;
}

export interface IMovementsRepository {
  getWalletMovements(walletId: string): Promise<IMovement[]>;
}
