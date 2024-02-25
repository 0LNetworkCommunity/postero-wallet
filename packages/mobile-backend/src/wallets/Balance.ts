import { Field, ObjectType } from '@nestjs/graphql';
import Coin from '../coin/Coin';
import { ICoin } from '../coin/interfaces';

@ObjectType("Balance")
class Balance {
  @Field()
  public amount: string;

  @Field(() => Coin)
  public coin: ICoin;

  public init(amount: string, coin: ICoin) {
    this.amount = amount;
    this.coin = coin;
  }
}

export default Balance;
