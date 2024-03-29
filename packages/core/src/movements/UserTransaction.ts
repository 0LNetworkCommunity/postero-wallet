import { Field, ObjectType } from "@nestjs/graphql";
import BN from "bn.js";
import { AbstractTransactionInput, GqlAbstractTransaction } from "./AbstractTransaction";

export type GqlUserTransactionInput = AbstractTransactionInput & {
  sender: string;
  success: boolean;
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  arguments: string;
  timestamp: BN;
};

@ObjectType("UserTransaction", {
  implements: () => [GqlAbstractTransaction],
})
export class GqlUserTransaction implements GqlAbstractTransaction {
  @Field(() => BN)
  public version: BN;

  @Field(() => BN)
  public timestamp: BN;

  @Field()
  public success: boolean;

  @Field(() => String)
  sender: string;

  @Field(() => String)
  moduleAddress: string;

  @Field(() => String)
  moduleName: string

  @Field(() => String)
  functionName: string;

  @Field(() => String)
  arguments: string;

  public constructor(input: GqlUserTransactionInput) {
    this.sender = input.sender;
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.success = input.success;
    this.moduleAddress = input.moduleAddress;
    this.moduleName = input.moduleName;
    this.functionName = input.functionName;
    this.arguments = input.arguments;
  }
}