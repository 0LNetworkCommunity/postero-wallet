import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { IKeychainService, IWalletKey } from './interfaces';
import WalletKey from './WalletKey';
import { Types } from '../../types';
import { PlatformTypes } from '../../platform/platform-types';
import { LocalAuthenticationService } from '../../platform/interfaces';

@Resolver()
class KeychainResolver {
  public constructor(
    @Inject(Types.IKeychainService)
    private readonly keychainService: IKeychainService,

    @Inject(PlatformTypes.LocalAuthenticationService)
    private readonly localAuthenticationService: LocalAuthenticationService,
  ) {}

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

  @Query(() => WalletKey)
  public async privateKey(
    @Args('publicKey', { type: () => Buffer })
    publicKey: Uint8Array,
  ): Promise<IWalletKey> {
    const keys = await this.keychainService.getWalletKey(publicKey);
    return keys;
  }

  @Query(() => Buffer)
  public async exportPrivateKey(
    @Args('publicKey', { type: () => Buffer, nullable: true })
    publicKey: Uint8Array,
  ): Promise<Uint8Array | null> {
    const success = await this.localAuthenticationService.authenticate();
    if (success) {
      const walletKey = await this.keychainService.getWalletKey(publicKey);
      const privateKey = await walletKey.getPrivateKey();
      return privateKey;
    }

    return null;
  }
}

export default KeychainResolver;
