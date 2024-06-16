import { Module, Scope } from '@nestjs/common';

import { Types } from '../types';
import WalletService from './WalletService';
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
import WalletResolver from './WalletResolver';
import { OlFyiModule } from '../ol-fyi/OlFyiModule';
import KeychainService from './keychain/KeychainService';
import KeychainRepository from './keychain/KeychainRepository';
import WalletKeyFactory from './keychain/WalletKeyFactory';
import WalletKey from './keychain/WalletKey';
import KeychainResolver from './keychain/KeychainResolver';
import WalletKeyResolver from './keychain/WalletKeyResolver';
import KeyRotationResolver from './key-rotation/KeyRotationResolver';
import KeyRotationService from './key-rotation/KeyRotationService';
import PendingTransactionsResolver from './transactions/PendingTransactionResolver';
import TransactionsService from './transactions/TransactionsService';
import TransactionsRepository from './transactions/TransactionsRepository';
import { TransactionFactory } from './transactions/TransactionFactory';
import { UserTransaction } from './transactions/UserTransaction';
import PendingTransactionsRepository from './transactions/PendingTransactionsRepository';
import PendingTransactionFactory from './transactions/PendingTransactionFactory';
import PendingTransactionsService from './transactions/PendingTransactionsService';
import PendingTransaction from './transactions/PendingTransaction';
import { TransactionsWatcherService } from './transactions/TransactionsWatcherService';
import { TransactionWatcher } from './transactions/TransactionWatcher';
import TransfersResolver from './transfers/TransfersResolver';
import MovementsResolver from './movements/MovementsResolver';
import Movement from './movements/Movement';
import MovementFactory from './movements/MovementFactory';
import MovementsRepository from './movements/MovementsRepository';
import MovementsService from './movements/MovementsService';
import { TransactionWatcherFactory } from './transactions/TransactionWatcherFactory';
import { PendingTransactionsUpdaterService } from './transactions/PendingTransactionsUpdaterService';

@Module({
  imports: [
    DbModule,
    CoinModule,
    OpenLibraModule,
    OlFyiModule,
  ],
  providers: [
    WalletsResolver,
    WalletResolver,
    KeychainResolver,
    WalletKeyResolver,
    KeyRotationResolver,
    TransfersResolver,
    PendingTransactionsResolver,
    MovementsResolver,

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
      provide: Types.IKeychainService,
      useClass: KeychainService,
    },
    {
      provide: Types.IKeychainRepository,
      useClass: KeychainRepository,
    },
    {
      provide: Types.IWalletKeyFactory,
      useClass: WalletKeyFactory,
    },
    {
      provide: Types.IWalletKey,
      useClass: WalletKey,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IKeyRotationService,
      useClass: KeyRotationService,
    },

    {
      provide: Types.ITransactionsService,
      useClass: TransactionsService,
    },
    {
      provide: Types.ITransactionsRepository,
      useClass: TransactionsRepository,
    },
    {
      provide: Types.ITransactionFactory,
      useClass: TransactionFactory,
    },
    {
      provide: Types.IUserTransaction,
      useClass: UserTransaction,
      scope: Scope.TRANSIENT,
    },

    {
      provide: Types.IPendingTransactionsRepository,
      useClass: PendingTransactionsRepository,
    },
    {
      provide: Types.IPendingTransactionFactory,
      useClass: PendingTransactionFactory,
    },
    {
      provide: Types.IPendingTransactionsService,
      useClass: PendingTransactionsService,
    },
    {
      provide: Types.IPendingTransactionsUpdaterService,
      useClass: PendingTransactionsUpdaterService,
    },
    {
      provide: Types.IPendingTransaction,
      useClass: PendingTransaction,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.ITransactionWatcherFactory,
      useClass: TransactionWatcherFactory,
    },

    {
      provide: Types.ITransactionsWatcherService,
      useClass: TransactionsWatcherService,
    },
    {
      provide: Types.ITransactionWatcher,
      useClass: TransactionWatcher,
      scope: Scope.TRANSIENT,
    },

    {
      provide: Types.IMovement,
      useClass: Movement,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IMovementFactory,
      useClass: MovementFactory,
    },
    {
      provide: Types.IMovementsRepository,
      useClass: MovementsRepository,
    },
    {
      provide: Types.IMovementsService,
      useClass: MovementsService,
    },
  ],
  exports: [
    Types.IWalletService,
    Types.IWalletRepository,
    Types.IKeychainService,
    Types.IKeyRotationService,
    Types.IPendingTransactionsService,
    Types.ITransactionsService,
    Types.ITransactionsWatcherService,
    Types.IMovementsService,
  ],
})
class WalletsModule {}

export default WalletsModule;
