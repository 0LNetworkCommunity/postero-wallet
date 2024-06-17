import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransactionInput,
  AbstractTransaction,
} from './AbstractTransaction';

export type ScriptUserTransactionInput = AbstractTransactionInput & {
  version: BN;
  sender: Uint8Array;
  success: boolean;
  timestamp: BN;
};

export interface IScriptUserTransaction {
  version: BN;
  hash: Uint8Array;
  timestamp: BN;
  success: boolean;
  sender: Uint8Array;

  init(input: ScriptUserTransactionInput): void;
}

@ObjectType('ScriptUserTransaction', {
  implements: () => [AbstractTransaction],
})
export class ScriptUserTransaction
  implements IScriptUserTransaction, AbstractTransaction
{
  @Field(() => BN)
  public version: BN;

  @Field(() => Buffer)
  public hash: Uint8Array;

  @Field(() => BN)
  public timestamp: BN;

  @Field()
  public success: boolean;

  @Field(() => Buffer)
  sender: Uint8Array;

  public init(input: ScriptUserTransactionInput) {
    this.sender = input.sender;
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.success = input.success;
  }
}
