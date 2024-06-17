import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransactionInput,
  AbstractTransaction,
} from './AbstractTransaction';

export type GenesisTransactionInput = AbstractTransactionInput & {
  version: BN;
};

export interface IGenesisTransaction {
  version: BN;
  hash: Uint8Array;

  init(input: GenesisTransactionInput): void;
}

@ObjectType('GenesisTransaction', {
  implements: () => [AbstractTransaction],
})
export class GenesisTransaction
  implements IGenesisTransaction, AbstractTransaction
{
  @Field(() => BN)
  public version: BN;

  @Field(() => Buffer)
  public hash: Uint8Array;

  public init(input: GenesisTransactionInput) {
    this.version = input.version;
    this.hash = input.hash;
  }
}
