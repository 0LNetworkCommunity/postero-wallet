import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';

import {
  AbstractTransactionInput,
  AbstractTransaction,
} from './AbstractTransaction';

export type BlockMetadataTransactionInput = AbstractTransactionInput & {
  version: BN;
  epoch: BN;
  timestamp: BN;
};

export interface IBlockMetadataTransaction {
  version: BN;
  hash: Uint8Array;
  epoch: BN;
  timestamp: BN;

  init(input: BlockMetadataTransactionInput): void;
}

@ObjectType('BlockMetadataTransaction', {
  implements: () => [AbstractTransaction],
})
export class BlockMetadataTransaction
  implements IBlockMetadataTransaction, AbstractTransaction
{
  @Field(() => BN)
  public version: BN;

  @Field(() => Buffer)
  public hash: Uint8Array;

  @Field(() => BN)
  public epoch: BN;

  @Field(() => BN)
  public timestamp: BN;

  public init(input: BlockMetadataTransactionInput) {
    this.timestamp = input.timestamp;
    this.version = input.version;
    this.hash = input.hash;
    this.epoch = input.epoch;
  }
}
