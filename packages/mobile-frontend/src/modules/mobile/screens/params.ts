
export type ModalStackParams = {
  Main: undefined;
  NewWallet: undefined;
  Wallet: { walletId: string };
  WalletPrivateKeys: { walletId: string };
  NewTransfer: { walletId: string };
  WalletDetails: { walletAddress: string };
  BarCodeScanner: {
    onScan: (data: string) => void;
  };
};