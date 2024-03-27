import { Field, ObjectType } from "@nestjs/graphql";
import BN from "bn.js";
import { AbstractTransactionInput, GqlAbstractTransaction } from "./AbstractTransaction";

export type GqlScriptUserTransactionInput = AbstractTransactionInput & {
  sender: string;
  success: boolean;
  timestamp: BN;
};

@ObjectType("ScriptUserTransaction", {
  implements: () => [GqlAbstractTransaction],
})
export class GqlScriptUserTransaction implements GqlAbstractTransaction {
  @Field(() => BN)
  public version: BN;

  @Field(() => BN)
  public timestamp: BN;

  @Field()
  public success: boolean;

  @Field(() => String)
  sender: string;

  public constructor(input: GqlScriptUserTransactionInput) {
    this.sender = input.sender;
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.success = input.success;
  }
}