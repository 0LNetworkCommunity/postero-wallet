import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import WalletKey from './WalletKey';
import { IWalletService, IGraphQLWallet } from '../interfaces';
import { GraphQLWallet } from '../GraphQLWallet';
import { Types } from '../../types';

@Resolver(WalletKey)
class WalletKeyResolver {
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @ResolveField(() => [GraphQLWallet])
  public async wallets(
    @Parent() walletKey: WalletKey,
  ): Promise<IGraphQLWallet[]> {
    const wallets = await this.walletService.getWalletsFromAuthKey(
      walletKey.authKey,
    );
    console.log('wallets', wallets);
    return wallets;
  }
}

export default WalletKeyResolver;
