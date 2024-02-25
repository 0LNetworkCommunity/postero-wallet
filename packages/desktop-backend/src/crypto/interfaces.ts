import AccountAddress from "./AccountAddress";
import AuthenticationKey from "./AuthenticationKey";

export interface CryptoWallet {
  mnemonic: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  authenticationKey: AuthenticationKey;
  accountAddress: AccountAddress;
}

export interface ICryptoService {
  walletFromMnemonic(mnemonic: string): Promise<CryptoWallet>;
  newWallet(): Promise<CryptoWallet>;
}
