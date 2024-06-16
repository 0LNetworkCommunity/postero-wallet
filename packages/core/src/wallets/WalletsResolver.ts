import { Inject } from '@nestjs/common';
import { Query, Resolver, Mutation, Subscription, Args } from '@nestjs/graphql';
import { Repeater } from '@repeaterjs/repeater';

import { Types } from '../types';
import {
  IGraphQLWallet,
  IWalletRepository,
  IWalletService,
  IGraphQLWalletFactory,
  WalletServiceEvent,
} from './interfaces';
import { GraphQLWallet } from './GraphQLWallet';
import { PlatformTypes } from '../platform/platform-types';
import { LocalAuthenticationService } from '../platform/interfaces';

@Resolver()
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
  public importPrivateKey(
    @Args('privateKey', { type: () => Buffer })
    privateKey: Uint8Array,
  ) {
    if (privateKey.length !== 32) {
      throw new Error('Invalid private key length. Must be 32 characters long');
    }

    return this.walletService.importPrivateKey(privateKey);
  }

  @Mutation((returns) => GraphQLWallet)
  public importMnemonic(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ) {
    return this.walletService.importMnemonic(mnemonic);
  }

  @Mutation((returns) => Boolean)
  public async setSlow(
    @Args('walletAddress', { type: () => Buffer })
    walletAddress: Uint8Array,
  ) {
    await this.walletService.setSlow(walletAddress);
    return true;
  }

  @Query((returns) => GraphQLWallet)
  public async wallet(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,
  ): Promise<IGraphQLWallet | null> {
    return this.walletRepository.getWallet(address);
  }

  @Query((returns) => [GraphQLWallet])
  public async wallets() {
    return this.walletService.getWallets();
  }

  @Mutation((returns) => Boolean)
  public async syncWallet(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,
  ) {
    await this.walletService.syncWallet(address);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteWallet(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,
  ) {
    const success = await this.localAuthenticationService.authenticate();
    if (success) {
      await this.walletService.deleteWallet(address);
      return true;
    }
    return false;
  }

  @Mutation(() => GraphQLWallet)
  public async newWalletFromMnemonic(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ): Promise<IGraphQLWallet> {
    const wallet = await this.walletService.importMnemonic(mnemonic);

    return this.graphQLWalletFactory.getGraphQLWallet(
      wallet.label,
      wallet.address,
    );
  }

  @Subscription((returns) => GraphQLWallet)
  public walletAdded() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.NewWallet,
        async (wallet: IGraphQLWallet) => {
          push({
            walletAdded: wallet,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription(() => GraphQLWallet)
  public walletUpdated() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.WalletUpdated,
        async (wallet: GraphQLWallet) => {
          push({
            walletUpdated: wallet,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription(() => Buffer)
  public walletRemoved() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.WalletRemoved,
        (address: Uint8Array) => {
          push({
            walletRemoved: address,
          });
        },
      );
      await stop;
      release();
    });
  }
}

export default WalletsResolver;
