import { Field, ObjectType } from '@nestjs/graphql';
import { ISlowWallet } from './interfaces';

@ObjectType("SlowWallet")
export class SlowWallet implements ISlowWallet {
  @Field()
  public transferred: string

  @Field()
  public unlocked: string

  public init(transferred: string, unlocked: string) {
    this.transferred = transferred;
    this.unlocked = unlocked;
  }
}
