import { Field, ObjectType } from "@nestjs/graphql";
import { GqlAbstractTransaction } from "./AbstractTransaction";
import { IMovement } from "./interfaces";
import BN from "bn.js";
import { Decimal } from "decimal.js";

export interface GqlMovementInput {
  // amount: Decimal;
  unlockedAmount: Decimal;
  lockedAmount: Decimal;

  balance: Decimal;
  lockedBalance: Decimal;

  version: BN;
  transaction: GqlAbstractTransaction;
}

@ObjectType("Movement")
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

  @Field(() => GqlAbstractTransaction)
  public transaction: GqlAbstractTransaction;

  public init(input: GqlMovementInput) {
    this.version = input.version;
    this.transaction = input.transaction;
    this.balance = input.balance;
    this.lockedBalance = input.lockedBalance;
    this.lockedAmount = input.lockedAmount;
    this.unlockedAmount = input.unlockedAmount;
  }
}

export default Movement;
