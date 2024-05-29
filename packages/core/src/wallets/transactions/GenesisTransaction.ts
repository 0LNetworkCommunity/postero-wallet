import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransactionInput,
  AbstractTransaction,
} from './AbstractTransaction';

export type BlockMetadataTransactionInput = AbstractTransactionInput;

@ObjectType('GenesisTransaction', {
  implements: () => [AbstractTransaction],
})
export class GenesisTransaction implements AbstractTransaction {
  @Field(() => BN)
  public version: BN;

  public constructor(input: BlockMetadataTransactionInput) {
    this.version = input.version;
  }
}
