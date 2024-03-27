import { Field, ObjectType } from '@nestjs/graphql';
import BN from 'bn.js';
import {
  AbstractTransactionInput,
  GqlAbstractTransaction,
} from './AbstractTransaction';

export type GqlBlockMetadataTransactionInput = AbstractTransactionInput;

@ObjectType('GenesisTransaction', {
  implements: () => [GqlAbstractTransaction],
})
export class GqlGenesisTransaction implements GqlAbstractTransaction {
  @Field(() => BN)
  public version: BN;

  public constructor(input: GqlBlockMetadataTransactionInput) {
    this.version = input.version;
  }
}
