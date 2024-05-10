import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { Types } from '../types';
import { IKeychainService } from './interfaces';

@Resolver()
class KeychainResolver {
  @Inject(Types.IKeychainService)
  private readonly keychainService!: IKeychainService;

  @Mutation(() => Boolean)
  public async createKeyFromMnemonic(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ) {
    const { publicKey, authKey } =
      await this.keychainService.newKeyFromMnemonic(mnemonic);
    console.log({
      publicKey: Buffer.from(publicKey).toString('hex'),
      authKey: Buffer.from(authKey).toString('hex'),
    });
    return true;
  }
}

export default KeychainResolver;
