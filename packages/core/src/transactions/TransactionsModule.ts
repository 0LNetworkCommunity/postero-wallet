import { Module, Scope } from "@nestjs/common";

import DbModule from "../db/DbModule";
import TransactionsRepository from "./TransactionsRepository";
import { Types } from "../types";
import TransactionsService from "./TransactionsService";
import Transaction from "./Transaction";
import PendingTransactionsService from "./PendingTransactionsService";
import PendingTransaction from "./PendingTransaction";
import PendingTransactionsResolver from "./PendingTransactionResolver";
import PendingTransactionFactory from "./PendingTransactionFactory";
import PendingTransactionsRepository from "./PendingTransactionsRepository";
import WalletsModule from "../wallets/WalletsModule";
import DAppsModule from "../dapps/DAppsModule";
import KeychainModule from "../keychain/KeychainModule";

@Module({
  imports: [DAppsModule, DbModule, WalletsModule, KeychainModule],
  providers: [
    PendingTransactionsResolver,
    {
      provide: Types.ITransactionsService,
      useClass: TransactionsService,
    },
    {
      provide: Types.ITransactionsRepository,
      useClass: TransactionsRepository,
    },
    {
      provide: Types.ITransaction,
      useClass: Transaction,
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
      provide: Types.IPendingTransaction,
      useClass: PendingTransaction,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [Types.IPendingTransactionsService],
})
class TransactionsModule {}

export default TransactionsModule;
