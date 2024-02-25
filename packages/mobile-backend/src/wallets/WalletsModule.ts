import { Module, Scope } from "@nestjs/common";

import WalletsResolver from "./WalletsResolver";
import GraphQLWallet from "./GraphQLWallet";
import { Types } from "../types";
import WalletService from "./WalletService";
import CryptoModule from "../crypto/CryptoModule";
import CoinModule from "../coin/CoinModule";
import OpenLibraModule from "../open-libra/OpenLibraModule";
import DbModule from "../db/DbModule";
import WalletRepository from "./WalletRepository";
import GraphQLWalletFactory from "./GraphQLWalletFactory";
import BalanceRepository from "./BalanceRepository";
import BalanceFactory from "./BalanceFactory";
import Balance from "./Balance";

@Module({
  imports: [
    DbModule,
    CryptoModule,
    CoinModule,
    OpenLibraModule,
  ],
  providers: [
    WalletsResolver,
    {
      provide: Types.IGraphQLWalletFactory,
      useClass: GraphQLWalletFactory,
    },
    {
      provide: Types.IGraphQLWallet,
      useClass: GraphQLWallet,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IWalletRepository,
      useClass: WalletRepository,
    },
    {
      provide: Types.IWalletService,
      useClass: WalletService,
    },
    {
      provide: Types.IBalanceRepository,
      useClass: BalanceRepository,
    },
    {
      provide: Types.IBalanceFactory,
      useClass: BalanceFactory,
    },
    {
      provide: Types.IBalance,
      useClass: Balance,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [Types.IWalletService, Types.IWalletRepository],
})
class WalletsModule {}

export default WalletsModule;
