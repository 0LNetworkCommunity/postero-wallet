import { Field, ID } from '@nestjs/graphql';
import { Injectable } from "@nestjs/common";
import { ITransaction } from "./interfaces";

@Injectable()
class Transaction implements ITransaction {
  @Field((type) => ID)
  public id: string;

  public init(
    id: string,
  ) {
    this.id = id;
  }
}

export default Transaction;
