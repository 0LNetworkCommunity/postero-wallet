import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { Repeater } from "@repeaterjs/repeater";
import { Inject } from "@nestjs/common";

import {
  IGraphQLWallet,
  IGraphQLWalletFactory,
  IWalletRepository,
  IWalletService,
  WalletServiceEvent,
} from "./interfaces";
import Wallet from "../crypto/Wallet";
import GraphQLWallet from "./GraphQLWallet";
import { Types } from "../types";
import { IWindowManagerSerivce } from "../window-manager/interfaces";
import { WindowType } from "../window-manager/types";
import Balance from "./Balance";

@Resolver((of) => GraphQLWallet)
class WalletsResolver {
  @Inject(Types.IWalletRepository)
  private readonly walletRepository!: IWalletRepository;

  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IGraphQLWalletFactory)
  private readonly graphQLWalletFactory!: IGraphQLWalletFactory;

  @Inject(Types.IWindowManagerService)
  private readonly windowManagerService!: IWindowManagerSerivce;

  @Query((returns) => GraphQLWallet)
  public async wallet(
    @Args("id", { type: () => ID })
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

  @Mutation((returns) => GraphQLWallet)
  public async newWallet() {
    const wallet = await this.walletService.newWallet();
    return this.walletMapper(wallet);
  }

  @Mutation((returns) => Boolean)
  public async openWalletWindow(
    @Args("id", { type: () => ID })
    id: string,
  ) {
    await this.windowManagerService.createWindow(WindowType.Wallet, { id });
    return id;
  }

  @Mutation((returns) => Boolean)
  public async setWalletLabel(
    @Args("id", { type: () => ID })
    id: string,

    @Args("label", { type: () => String })
    label: string,
  ) {
    await this.walletService.setWalletLabel(id, label);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async importWallet(
    @Args("mnemonic", { type: () => String })
    mnemonic: string,
  ) {
    await this.walletService.importWallet(mnemonic);
    return true;
  }

  @ResolveField((returns) => [Balance])
  public async balances(@Parent() wallet: GraphQLWallet) {
    try {
      await this.walletService.syncWallet(wallet.id);
    } catch (error) {}
    return await wallet.balances();
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

  @Subscription(() => GraphQLWallet)
  public walletUpdated() {
    return new Repeater(async (push, stop) => {
      const release = this.walletService.on(
        WalletServiceEvent.WalletUpdated,
        async (wallet: Wallet) => {
          const graphqlWallet = await this.walletMapper(wallet);
          push({
            walletUpdated: graphqlWallet,
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
