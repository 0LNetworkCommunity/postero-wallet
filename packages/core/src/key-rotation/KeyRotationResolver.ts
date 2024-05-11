import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { Types } from '../types';
import { IKeyRotationService } from './interfaces';

@Resolver()
class KeyRotationResolver {
  @Inject(Types.IKeyRotationService)
  private readonly keyRotationService!: IKeyRotationService;

  @Mutation(() => Boolean)
  public async sendKeyRotationTransaction(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,

    @Args('newPublicKey', { type: () => Buffer })
    newPublicKey: Uint8Array,
  ): Promise<boolean> {
    await this.keyRotationService.sendKeyRotationTransaction(
      address,
      newPublicKey,
    );
    return true;
  }
}

export default KeyRotationResolver;
