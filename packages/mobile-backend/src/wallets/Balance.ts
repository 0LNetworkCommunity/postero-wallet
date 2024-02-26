import { Field, ObjectType } from '@nestjs/graphql';
import Coin from '../coin/Coin';
import { ICoin } from '../coin/interfaces';
import { IBalance } from './interfaces';

@ObjectType("Balance")
export class Balance implements IBalance {
  @Field()
  public amount: string

  @Field(() => Coin)
  public coin: ICoin;

  public init(amount: string, coin: ICoin) {
    this.amount = amount;
    this.coin = coin;
  }
}
