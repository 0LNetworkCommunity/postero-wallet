import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import WalletKey from "./WalletKey";
import { IGraphQLWallet } from '../wallets/interfaces';
import { GraphQLWallet } from "../wallets/GraphQLWallet";
import { Inject } from "@nestjs/common";
import { Types } from "../types";
import { IWalletService } from "../main";

@Resolver(WalletKey)
class WalletKeyResolver {
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @ResolveField(() => [GraphQLWallet])
  public async wallets(@Parent() walletKey: WalletKey): Promise<IGraphQLWallet[]> {
    const wallets = await this.walletService.getWalletsFromAuthKey(walletKey.authKey);
    console.log('wallets', wallets);
    return wallets;
  }
}

export default WalletKeyResolver;
