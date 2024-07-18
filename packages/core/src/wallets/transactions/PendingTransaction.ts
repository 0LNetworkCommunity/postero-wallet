import { Field, ObjectType } from '@nestjs/graphql';
import {
  IPendingTransaction,
  PendingTransactionArgs,
  PendingTransactionStatus,
} from './interfaces';
import { AbstractTransaction } from './AbstractTransaction';
import { Deserializer, SignedTransaction } from '@aptos-labs/ts-sdk';

@ObjectType('PendingTransaction', {
  implements: () => [AbstractTransaction],
})
class PendingTransaction implements AbstractTransaction, IPendingTransaction {
  @Field((type) => Buffer)
  public hash: Uint8Array;

  @Field((type) => PendingTransactionStatus)
  public status: PendingTransactionStatus;

  @Field((type) => Buffer)
  payload: Buffer;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Number)
  expirationTimestamp: number;

  @Field((type) => Buffer)
  sender: Uint8Array;

  public init(args: PendingTransactionArgs) {
    this.payload = args.payload;
    this.createdAt = args.createdAt;
    this.hash = args.hash;
    this.status = args.status;
    this.expirationTimestamp = args.expirationTimestamp;

    const deserializer = new Deserializer(args.payload);
    const txPayload = SignedTransaction.deserialize(deserializer);
    this.sender = txPayload.raw_txn.sender.data
  }
}

export default PendingTransaction;
