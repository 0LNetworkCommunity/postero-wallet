import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import { AbstractTransaction } from './AbstractTransaction';
import { IUserTransaction, UserTransactionInput } from './interfaces';

@ObjectType('UserTransaction', {
  implements: () => [AbstractTransaction],
})
export class UserTransaction implements IUserTransaction, AbstractTransaction {
  @Field(() => BN)
  public version: BN;

  @Field(() => BN)
  public timestamp: BN;

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
  }
}
