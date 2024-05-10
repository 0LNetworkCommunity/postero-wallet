
export type ModalStackParams = {
  Main: undefined;
  NewWallet: undefined;
  Wallet: { walletAddress: string };
  WalletPrivateKeys: { walletAddress: string };
  NewTransfer: { walletAddress: string };
  WalletDetails: { walletAddress: string };
  BarCodeScanner: {
    onScan: (data: string) => void;
  };
  Settings: undefined;
  KeyRotation: { walletAddress: string };
};