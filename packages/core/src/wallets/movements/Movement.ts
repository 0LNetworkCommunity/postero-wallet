import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import { Decimal } from 'decimal.js';

import { AbstractTransaction } from '../transactions/AbstractTransaction';
import { IMovement } from './interfaces';

export interface MovementInput {
  // amount: Decimal;
  unlockedAmount: Decimal;
  lockedAmount: Decimal;

  balance: Decimal;
  lockedBalance: Decimal;

  version: BN;
  transaction: AbstractTransaction;
}

@ObjectType('Movement')
class Movement implements IMovement {
  @Field(() => BN)
  public version: BN;

  @Field(() => Decimal)
  public unlockedAmount: Decimal;

  @Field(() => Decimal)
  public lockedAmount: Decimal;

  @Field(() => Decimal)
  public balance: Decimal;

  @Field(() => Decimal)
  public lockedBalance: Decimal;

  @Field(() => AbstractTransaction)
  public transaction: AbstractTransaction;

  public init(input: MovementInput) {
    this.version = input.version;
    this.transaction = input.transaction;
    this.balance = input.balance;
    this.lockedBalance = input.lockedBalance;
    this.lockedAmount = input.lockedAmount;
    this.unlockedAmount = input.unlockedAmount;
  }
}

export default Movement;
