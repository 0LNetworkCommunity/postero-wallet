import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { IKeyRotationService } from './interfaces';
import { Types } from '../../types';

@Resolver()
class KeyRotationResolver {
  @Inject(Types.IKeyRotationService)
  private readonly keyRotationService!: IKeyRotationService;

  @Mutation(() => Buffer)
  public async sendKeyRotationTransaction(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,

    @Args('newPublicKey', { type: () => Buffer })
    newPublicKey: Uint8Array,
  ): Promise<Uint8Array> {
    return this.keyRotationService.sendKeyRotationTransaction(
      address,
      newPublicKey,
    );
  }
}

export default KeyRotationResolver;
