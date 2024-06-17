import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field((type) => Buffer, { nullable: true })
  public hash: Uint8Array;

  public constructor(hash: Uint8Array) {
    this.hash = hash;
  }
}
