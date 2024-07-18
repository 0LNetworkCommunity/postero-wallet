import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransaction,
  AbstractTransactionInput,
} from './AbstractTransaction';

export interface IUserTransaction {
  version: BN;
  hash: Uint8Array;
  timestamp: BN;
  success: boolean;
  sender: Uint8Array;
  moduleAddress: Uint8Array;
  moduleName: string;
  functionName: string;
  arguments: string;

  init(input: UserTransactionInput): void;
}

export type UserTransactionInput = AbstractTransactionInput & {
  version: BN;
  gasUsed: BN;
  sender: Uint8Array;
  hash: Uint8Array;
  success: boolean;
  moduleAddress: Uint8Array;
  moduleName: string;
  functionName: string;
  arguments: string;
  timestamp: BN;
};

@ObjectType('UserTransaction', {
  implements: () => [AbstractTransaction],
})
export class UserTransaction implements IUserTransaction, AbstractTransaction {
  @Field(() => BN)
  public version: BN;

  @Field(() => BN)
  public timestamp: BN;

  @Field(() => BN)
  public gasUsed: BN;

  @Field()
  public success: boolean;

  @Field(() => Buffer)
  hash: Uint8Array;

  @Field(() => Buffer)
  sender: Uint8Array;

  @Field(() => Buffer)
  moduleAddress: Uint8Array;

  @Field(() => String)
  moduleName: string;

  @Field(() => String)
  functionName: string;

  @Field(() => String)
  arguments: string;

  public init(input: UserTransactionInput) {
    this.sender = input.sender;
    this.hash = input.hash;
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.success = input.success;
    this.moduleAddress = input.moduleAddress;
    this.moduleName = input.moduleName;
    this.functionName = input.functionName;
    this.arguments = input.arguments;
    this.gasUsed = input.gasUsed;
  }
}
