
export type ModalStackParams = {
  Main: undefined;
  NewWallet: undefined;
  Wallet: { walletAddress: string };
  WalletPrivateKeys: { walletAddress: string };
  NewTransfer: { walletAddress: string };
  WalletDetails: { label: string; address: string };
  BarCodeScanner: {
    onScan: (data: string) => void;
  };
  Settings: undefined;
  KeyRotation: { walletAddress: string };
  PrivateKeys: undefined;
  PrivateKey: {
    publicKey: string;
  };
  Transactions: undefined;
  Transaction: undefined;
  PendingTransaction: {
    id: string;
  };
  PendingTransactions: undefined;
};