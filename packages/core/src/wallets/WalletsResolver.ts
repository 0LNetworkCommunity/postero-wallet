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
import { normalizeHexString } from '../utils';

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

  @Mutation((returns) => Boolean)
  public async importPrivateKey(
    @Args('privateKey', { type: () => String })
    privateKey: string,
  ) {
    const privateKeyHex = normalizeHexString(privateKey.trim());
    if (privateKeyHex.length !== 64) {
      throw new Error('Invalid private key length. Must be 64 characters long');
    }

    await this.walletService.importPrivateKey(
      Buffer.from(privateKeyHex, 'hex'),
    );

    return true;
  }

  @Mutation((returns) => Boolean)
  public async importAddress(
    @Args('address', { type: () => String })
    address: string,
  ) {
    // await this.walletService.importWallet(mnemonic);
    console.log('>>', address);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async importMnemonic(
    @Args('mnemonic', { type: () => String })
    mnemonic: string,
  ) {
    await this.walletService.importMnemonic(mnemonic);
    return true;
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
    const wallet = await this.walletRepository.getWallet(address);
    if (!wallet) {
      return null;
    }
    return this.walletMapper(wallet);
  }

  @Query((returns) => [GraphQLWallet])
  public async wallets() {
    const wallets = await this.walletRepository.getWallets();
    return Promise.all(wallets.map((wallet) => this.walletMapper(wallet)));
  }

  @Mutation((returns) => Boolean)
  public async syncWallet(
    @Args('address', { type: () => String })
    address: string,
  ) {
    await this.walletService.syncWallet(Buffer.from(address, 'hex'));
    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteWallet(
    @Args('address', { type: () => String })
    address: string,
  ) {
    const success = await this.localAuthenticationService.authenticate();
    if (success) {
      await this.walletService.deleteWallet(Buffer.from(address, 'hex'));
      return true;
    }
    return false;
  }

  @ResolveField((returns) => [Balance])
  public async balances(@Parent() wallet: GraphQLWallet) {
    try {
      await this.walletService.syncWallet(wallet.address);
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
      wallet.label,
      wallet.address,
    );
  }
}

export default WalletsResolver;
