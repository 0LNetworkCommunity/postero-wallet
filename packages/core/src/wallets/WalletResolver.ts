import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { GraphQLWallet } from './GraphQLWallet';
import { SlowWallet } from './SlowWallet';
import { Balance } from './Balance';
import { ISlowWallet, IWalletService } from './interfaces';
import { Types } from '../types';
import WalletKey from '../keychain/WalletKey';
import { IWalletKey } from '../keychain/interfaces';

@Resolver(GraphQLWallet)
class WalletResolver {
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @ResolveField(() => SlowWallet, { nullable: true })
  public async slowWallet(
    @Parent() wallet: GraphQLWallet,
  ): Promise<ISlowWallet | undefined> {
    return wallet.slowWallet();
  }

  @ResolveField(() => [Balance])
  public async balances(@Parent() wallet: GraphQLWallet) {
    try {
      await this.walletService.syncWallet(wallet.address);
    } catch (error) {
      console.error(error);
    }
    return wallet.balances();
  }

  @ResolveField(() => [WalletKey])
  public async keys(@Parent() wallet: GraphQLWallet): Promise<IWalletKey[]> {
    return wallet.keys();
  }
}

export default WalletResolver;
