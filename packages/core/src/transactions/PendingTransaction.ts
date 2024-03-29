import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IPendingTransaction } from "./interfaces";
import DApp from "../dapps/DApp";
import { IDApp } from "../dapps/interfaces";

@ObjectType("PendingTransaction")
class PendingTransaction implements IPendingTransaction {
  @Field((type) => ID)
  public id: string;

  @Field((type) => DApp)
  dApp: IDApp;

  @Field((type) => String)
  type: string;

  @Field((type) => Buffer)
  payload: Buffer;

  @Field((type) => Date)
  createdAt: Date;

  public init(
    id: string,
    dApp: IDApp,
    type: string,
    payload: Buffer,
    createdAt: Date,
  ) {
    this.id = id;
    this.dApp = dApp;
    this.type = type;
    this.payload = payload;
    this.createdAt = createdAt;
  }
}

export default PendingTransaction;
