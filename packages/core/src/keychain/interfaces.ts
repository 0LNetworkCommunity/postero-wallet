export interface IKeychainService {
  newKeyFromMnemonic(mnemonic: string): Promise<IWalletKey>;
  newKeyFromPrivateKey(privateKey: Uint8Array): Promise<IWalletKey>;
  getWalletKey(publicKey: Uint8Array): Promise<IWalletKey>;
  getWalletKeyFromAuthKey(authKey: Uint8Array): Promise<IWalletKey>;
  getWalletKeys(): Promise<IWalletKey[]>;
  getWalletWalletKeys(address: Uint8Array): Promise<IWalletKey[]>;
}

export interface IKeychainRepository {
  saveKey(publicKey: Uint8Array, authKey: Uint8Array): Promise<void>;
  getWalletKey(publicKey: Uint8Array): Promise<IWalletKey>;
  getWalletKeyFromAuthKey(authKey: Uint8Array): Promise<IWalletKey>;
  getWalletKeys(): Promise<IWalletKey[]>;
  getWalletWalletKeys(address: Uint8Array): Promise<IWalletKey[]>;
}

export interface IWalletKey {
  publicKey: Uint8Array;
  authKey: Uint8Array;

  getPrivateKey(): Promise<Uint8Array>;
}

export interface IWalletKeyFactory {
  createWalletKey(
    publicKey: Uint8Array,
    authKey: Uint8Array,
  ): Promise<IWalletKey>;
}