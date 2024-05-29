import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { IKeyRotationService } from './interfaces';
import { Types } from '../../types';

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
