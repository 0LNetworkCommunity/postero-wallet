import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { IMovement, IMovementFactory } from './interfaces';
import Movement, { MovementInput } from './Movement';
import { Types } from '../../types';

@Injectable()
class MovementFactory implements IMovementFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createMovement(input: MovementInput): Promise<IMovement> {
    const movement = await this.moduleRef.resolve<Movement>(Types.IMovement);
    movement.init(input);
    return movement;
  }
}

export default MovementFactory;
