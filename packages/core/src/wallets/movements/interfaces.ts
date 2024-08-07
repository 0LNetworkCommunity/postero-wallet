import BN from 'bn.js';
import { Decimal } from 'decimal.js';

import { AbstractTransaction } from '../transactions/AbstractTransaction';
import { MovementInput } from './Movement';
import { IUserTransaction } from '../transactions/UserTransaction';
import { IScriptUserTransaction } from '../transactions/ScriptUserTransaction';
import { IBlockMetadataTransaction } from '../transactions/BlockMetadataTransaction';
import { IGenesisTransaction } from '../transactions/GenesisTransaction';

export interface IMovement {
  version: BN;
  transaction: AbstractTransaction;

  unlockedAmount: Decimal;
  lockedAmount: Decimal;

  balance: Decimal;
  lockedBalance: Decimal;

  init(input: MovementInput): void;
}

export interface IMovementsService {
  getWalletMovements(walletAddress: Uint8Array): Promise<IMovement[]>;
}

export interface IMovementFactory {
  createMovement(input: MovementInput): Promise<IMovement>;
}

export interface IMovementsRepository {
  getWalletMovements(walletAddress: Uint8Array): Promise<IMovement[]>;
}

export type OnChainTransaction =
  | IUserTransaction
  | IScriptUserTransaction
  | IBlockMetadataTransaction
  | IGenesisTransaction;
