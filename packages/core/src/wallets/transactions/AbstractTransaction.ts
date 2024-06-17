import { Field, InterfaceType } from '@nestjs/graphql';

export interface AbstractTransactionInput {
  hash: Uint8Array;
}

@InterfaceType('AbstractTransaction')
export abstract class AbstractTransaction {
  @Field(() => Buffer)
  public hash: Uint8Array;
}
