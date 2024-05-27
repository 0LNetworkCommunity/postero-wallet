import { Module, Scope, forwardRef } from '@nestjs/common';

import { Types } from '../types';
import WalletService from './WalletService';
import CryptoModule from '../crypto/CryptoModule';
import CoinModule from '../coin/CoinModule';
import OpenLibraModule from '../open-libra/OpenLibraModule';
import DbModule from '../db/DbModule';
import WalletRepository from './WalletRepository';
import GraphQLWalletFactory from './GraphQLWalletFactory';
import BalanceRepository from './BalanceRepository';
import BalanceFactory from './BalanceFactory';
import WalletsResolver from './WalletsResolver';
import { GraphQLWallet } from './GraphQLWallet';
import { Balance } from './Balance';
import SlowWalletFactory from './SlowWalletFactory';
import { SlowWallet } from './SlowWallet';
import KeychainModule from '../keychain/KeychainModule';
import WalletResolver from './WalletResolver';
import { WalletsWatcherService } from './WalletsWatcherService';
import { WalletWatcherFactory } from "./WalletWatcherFactory";
import { WalletWatcher } from './WalletWatcher';
import { OlFyiModule } from '../ol-fyi/OlFyiModule';

@Module({
  imports: [
    DbModule,
    CryptoModule,
    CoinModule,
    OpenLibraModule,
    OlFyiModule,
    forwardRef(() => KeychainModule),
  ],
  providers: [
    WalletsResolver,
    WalletResolver,

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
      provide: Types.ISlowWalletFactory,
      useClass: SlowWalletFactory,
    },
    {
      provide: Types.ISlowWallet,
      useClass: SlowWallet,
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
      provide: Types.IWalletsWatcherService,
      useClass: WalletsWatcherService,
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

    {
      provide: Types.IWalletWatcherFactory,
      useClass: WalletWatcherFactory,
    },
    {
      provide: Types.IWalletWatcher,
      useClass: WalletWatcher,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [
    Types.IWalletService,
    Types.IWalletRepository,
    Types.IWalletsWatcherService,
  ],
})
class WalletsModule {}

export default WalletsModule;
