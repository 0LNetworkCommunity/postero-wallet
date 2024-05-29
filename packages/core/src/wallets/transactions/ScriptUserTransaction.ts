import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransactionInput,
  AbstractTransaction,
} from './AbstractTransaction';

export type ScriptUserTransactionInput = AbstractTransactionInput & {
  sender: Uint8Array;
  success: boolean;
  timestamp: BN;
};

@ObjectType('ScriptUserTransaction', {
  implements: () => [AbstractTransaction],
})
export class ScriptUserTransaction implements AbstractTransaction {
  @Field(() => BN)
  public version: BN;

  @Field(() => BN)
  public timestamp: BN;

  @Field()
  public success: boolean;

  @Field(() => Buffer)
  sender: Uint8Array;

  public constructor(input: ScriptUserTransactionInput) {
    this.sender = input.sender;
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.success = input.success;
  }
}
