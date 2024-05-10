import { WalletKey } from "./types";

export interface IKeychainService {
  newKeyFromMnemonic(mnemonic: string): Promise<WalletKey>;
  newKeyFromPrivateKey(privateKey: Uint8Array): Promise<WalletKey>;
}

export interface IKeychainRepository {
  saveKey(publicKey: Uint8Array, authKey: Uint8Array): Promise<void>;
}
