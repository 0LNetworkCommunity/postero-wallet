import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { Types } from '../types';
import { IKeychainService, IWalletKey } from './interfaces';
import WalletKey from './WalletKey';

@Resolver()
class KeychainResolver {
  @Inject(Types.IKeychainService)
  private readonly keychainService!: IKeychainService;

  @Mutation(() => WalletKey)
  public async createKeyFromMnemonic(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ): Promise<IWalletKey> {
    const walletKey = await this.keychainService.newKeyFromMnemonic(mnemonic);
    return walletKey;
  }

  @Query(() => [WalletKey])
  public async privateKeys(): Promise<IWalletKey[]> {
    const keys = await this.keychainService.getWalletKeys();
    return keys;
  }
}

export default KeychainResolver;
