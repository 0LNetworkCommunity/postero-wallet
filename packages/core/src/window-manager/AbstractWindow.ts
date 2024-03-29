import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { WindowState } from './types';

@InterfaceType("Window")
export abstract class AbstractWindow {
  @Field(() => Boolean)
  frame: boolean;

  @Field(() => WindowState)
  public state: WindowState;

  @Field()
  name: string;
}
