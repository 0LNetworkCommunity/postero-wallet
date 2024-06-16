export type ModalStackParams = {
  Main: undefined;
  NewWallet: undefined;
  Wallet: { walletAddress: string };
  WalletPrivateKeys: { walletAddress: string };
  NewTransfer: {
    walletAddress: string;
    barCodeResult?: string;
  };
  WalletDetails: { label: string; address: string };
  BarCodeScanner: {
    redirect: keyof ModalStackParams;
  };
  KeyRotation: { walletAddress: string };
  PrivateKeys: undefined;
  PrivateKey: {
    publicKey: string;
  };
  Transaction: undefined;
  PendingTransaction: {
    id: string;
  };
};
