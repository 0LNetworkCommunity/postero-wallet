import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Aptos, Deserializer, TransactionPayload } from '@aptos-labs/ts-sdk';
import {
  IPendingTransaction,
  PendingTransactionArgs,
  PendingTransactionStatus,
} from './interfaces';

@ObjectType('PendingTransaction')
class PendingTransaction implements IPendingTransaction {
  @Field((type) => ID)
  public id: string;

  @Field((type) => Buffer, { nullable: true })
  public hash?: Uint8Array;

  @Field((type) => PendingTransactionStatus)
  public status: PendingTransactionStatus;

  @Field((type) => String)
  type: string;

  @Field((type) => Buffer)
  payload: Buffer;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Number)
  expirationTimestamp: number;

  public init(args: PendingTransactionArgs) {
    this.id = args.id;
    this.type = args.type;
    this.payload = args.payload;
    this.createdAt = args.createdAt;
    this.hash = args.hash;
    this.status = args.status;
    this.expirationTimestamp = args.expirationTimestamp;

    // const deserializer = new Deserializer(args.payload);
    // const txPayload = TransactionPayload.deserialize(deserializer);
    // console.log('txPayload', txPayload);
  }
}

export default PendingTransaction;
