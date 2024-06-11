export enum Types {
  ICryptoService = "ICryptoService",
  ICryptoImplService = "ICryptoImplService",

  IDbService = "IDbService",

  IOpenLibraService = "IOpenLibraService",

  IWalletService = "IWalletService",
  IWalletRepository = "IWalletRepository",

  ITransactionsWatcherService = "ITransactionsWatcherService",
  ITransactionWatcher = "ITransactionWatcher",
  ITransactionWatcherFactory = "ITransactionWatcherFactory",

  ICoin = "ICoin",
  ICoinRepository = "ICoinRepository",
  ICoinFactory = "ICoinFactory",

  IDAppRepository = "IDAppRepository",

  IIpcService = "IIpcService",

  IRpcService = "IRpcService",

  IBrowserBridge = "IBrowserBridge",
  IBrowserBridgeFactory = "IBrowserBridgeFactory",

  IBrowserTab = "IBrowserTab",
  IBrowserTabFactory = "IBrowserTabFactory",
  IBrowserTabService = "IBrowserTabService",

  IApp = "IApp",

  IDAppService = "IDAppService",
  IDApp = "IDApp",
  IDAppInstance = "IDAppInstance",
  IDAppFactory = "IDAppFactory",
  IDAppInstanceFactory = "IDAppInstanceFactory",
  IDAppResolver = "IDAppResolver",

  IConnectionRequest = "IConnectionRequest",
  IConnectionRequestFactory = "IConnectionRequestFactory",

  IGraphQLService = "IGraphQLService",

  IWalletsResolver = "IWalletsResolver",

  IGraphQLWalletFactory = "IGraphQLWalletFactory",
  IGraphQLWallet = "IGraphQLWallet",

  ISlowWalletFactory = "ISlowWalletFactory",
  ISlowWallet = "ISlowWallet",

  IRecipeService = "IRecipeService",
  IRecipeResolver = "IRecipeResolver",

  IWindowFactory = "IWindowFactory",
  IWindowManagerService = "IWindowManagerService",

  ITransaction = "ITransaction",
  ITransactionsService = "ITransactionsService",
  ITransactionsRepository = "ITransactionsRepository",
  ITransactionFactory = "ITransactionFactory",
  IUserTransaction = "IUserTransaction",
  IPendingTransactionsService = "IPendingTransactionsService",
  IPendingTransaction = "IPendingTransaction",
  IPendingTransactionFactory = "IPendingTransactionFactory",
  IPendingTransactionsRepository = "IPendingTransactionsRepository",
  IPendingTransactionsUpdaterService = "IPendingTransactionsUpdaterService",

  IBalance = "IBalance",
  IBalanceFactory = "IBalanceFactory",
  IBalanceRepository = "IBalanceRepository",

  IMovementsService = "IMovementsService",
  IMovement = "IMovement",
  IMovementFactory = "IMovementFactory",
  IMovementsRepository = "IMovementsRepository",

  IKeychainService = "IKeychainService",
  IKeychainRepository = "IKeychainRepository",
  IWalletKey = "IWalletKey",
  IWalletKeyFactory = "IWalletKeyFactory",

  IKeyRotationService = "IKeyRotationService",

  ITransfersService = "ITransfersService",

  ISettingsRepository = "ISettingsRepository",

  IOlFyiService = "IOlFyiService",
}