import { Inject } from '@nestjs/common';
import {
  Query,
  Resolver,
  Mutation,
  Subscription,
  ID,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Repeater } from '@repeaterjs/repeater';

import { Types } from '../types';
import {
  IGraphQLWallet,
  IWalletRepository,
  IWalletService,
  IGraphQLWalletFactory,
  WalletServiceEvent,
  ISlowWallet,
} from './interfaces';
import Wallet from '../crypto/Wallet';
import { GraphQLWallet } from './GraphQLWallet';
import { Balance } from './Balance';
import { PlatformTypes } from '../platform/platform-types';
import { LocalAuthenticationService } from '../platform/interfaces';
import { SlowWallet } from './SlowWallet';

@Resolver(GraphQLWallet)
class WalletsResolver {
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository!: IWalletRepository;

  @Inject(Types.IGraphQLWalletFactory)
  private readonly graphQLWalletFactory!: IGraphQLWalletFactory;

  @Inject(PlatformTypes.LocalAuthenticationService)
  private readonly localAuthenticationService!: LocalAuthenticationService;

  @Mutation((returns) => GraphQLWallet)
  public async newWallet() {
    const wallet = await this.walletService.newWallet();
    return wallet;
  }

  @Mutation((returns) => Boolean)
  public async importWallet(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ) {
    await this.walletService.importWallet(mnemonic);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async setSlow(
    @Args('walletId', { type: () => ID })
    walletId: string,
  ) {
    await this.walletService.setSlow(walletId);
    return true;
  }

  @Query((returns) => GraphQLWallet)
  public async wallet(
    @Args('id', { type: () => ID })
    id: string,
  ): Promise<IGraphQLWallet | null> {
    const wallet = await this.walletRepository.getWallet(id);
    if (!wallet) {
      return null;
    }
    return this.walletMapper(wallet);
  }

  @Query((returns) => [GraphQLWallet])
  public async wallets() {
    const wallets = await this.walletRepository.getWallets();
    return wallets.map((wallet) => this.walletMapper(wallet));
  }

  @Mutation((returns) => Boolean)
  public async syncWallet(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    await this.walletService.syncWallet(id);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteWallet(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    const success = await this.localAuthenticationService.authenticate();
    if (success) {
      await this.walletService.deleteWallet(id);
      return true;
    }
    return false;
  }

  @ResolveField((returns) => [Balance])
  public async balances(@Parent() wallet: GraphQLWallet) {
    try {
      await this.walletService.syncWallet(wallet.id);
    } catch (error) {
      console.error(error);
    }
    return wallet.balances();
  }

  @ResolveField((returns) => SlowWallet, { nullable: true })
  public async slowWallet(
    @Parent() wallet: GraphQLWallet,
  ): Promise<ISlowWallet | undefined> {
    return wallet.slowWallet();
  }

  @Subscription((returns) => GraphQLWallet)
  public walletAdded() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.NewWallet,
        async (wallet: Wallet) => {
          const graphqlWallet = await this.walletMapper(wallet);
          push({
            walletAdded: graphqlWallet,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription(() => ID)
  public walletRemoved() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.WalletRemoved,
        (walletId: string) => {
          push({
            walletRemoved: walletId,
          });
        },
      );
      await stop;
      release();
    });
  }

  private walletMapper(wallet: Wallet): Promise<IGraphQLWallet> {
    return this.graphQLWalletFactory.getGraphQLWallet(
      `${wallet.id}`,
      wallet.label,
      wallet.publicKey,
      wallet.authenticationKey,
      wallet.accountAddress,
    );
  }
}

export default WalletsResolver;
