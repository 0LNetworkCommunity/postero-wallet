import { Inject, Injectable } from '@nestjs/common';
import { IMovement, IMovementFactory } from './interfaces';
import { ModuleRef } from '@nestjs/core';
import Movement, { GqlMovementInput } from './Movement';
import { Types } from '../types';

@Injectable()
class MovementFactory implements IMovementFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createMovement(input: GqlMovementInput): Promise<IMovement> {
    const movement = await this.moduleRef.resolve<Movement>(Types.IMovement);
    movement.init(input);
    return movement;
  }
}

export default MovementFactory;
