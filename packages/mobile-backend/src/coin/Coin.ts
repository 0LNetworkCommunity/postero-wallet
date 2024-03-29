import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ICoin } from "./interfaces";

@ObjectType("RNCoin")
class Coin implements ICoin {
  @Field((type) => ID)
  public id: string;

  @Field()
  public name: string;

  @Field()
  public type: string;

  @Field()
  public decimals: number;

  @Field()
  public symbol: string;

  public init(
    id: string,
    name: string,
    type: string,
    decimals: number,
    symbol: string,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.decimals = decimals;
    this.symbol = symbol;
  }
}

export default Coin;
