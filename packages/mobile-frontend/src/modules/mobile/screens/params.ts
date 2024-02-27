
export type ModalStackParams = {
  Main: undefined;
  NewWallet: undefined;
  Wallet: { walletId: string };
  NewTransfer: { walletId: string };
  WalletDetails: { walletAddress: string };
  BarCodeScanner: {
    onScan: (data: string) => void;
  };
};