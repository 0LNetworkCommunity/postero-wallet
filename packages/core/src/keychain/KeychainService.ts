import { Inject, Injectable } from '@nestjs/common';
import {
  IKeychainRepository,
  IKeychainService,
  IWalletKey,
  IWalletKeyFactory,
} from './interfaces';
import {
  mnemonicToPrivateKey,
  privateKeyToPublicKey,
  publicKeyToAuthKey,
} from '../crypto';
import { Types } from '../types';
import { PlatformTypes } from '../platform/platform-types';
import {
  EncryptedStoreRule,
  PlatformEncryptedStoreService,
} from '../platform/interfaces';

@Injectable()
class KeychainService implements IKeychainService {
  @Inject(Types.IKeychainRepository)
  private readonly keychainRepository: IKeychainRepository;

  @Inject(Types.IWalletKeyFactory)
  private readonly walletKeyFactory: IWalletKeyFactory;

  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  public async newKeyFromMnemonic(mnemonic: string): Promise<IWalletKey> {
    const privateKey = mnemonicToPrivateKey(mnemonic);
    return this.newKeyFromPrivateKey(privateKey);
  }

  public async newKeyFromPrivateKey(
    privateKey: Uint8Array,
  ): Promise<IWalletKey> {
    const publicKey = privateKeyToPublicKey(privateKey);
    const authKey = publicKeyToAuthKey(publicKey);

    await this.keychainRepository.saveKey(publicKey, authKey);

    await this.platformEncryptedStoreService.setItem(
      Buffer.from(publicKey).toString('hex').toUpperCase(),
      Buffer.from(privateKey).toString('hex').toUpperCase(),
      EncryptedStoreRule.WhenUnlockedThisDeviceOnly,
    );
    return this.walletKeyFactory.createWalletKey(publicKey, authKey);
  }

  public getWalletKeyFromAuthKey(authKey: Uint8Array): Promise<IWalletKey> {
    return this.keychainRepository.getWalletKeyFromAuthKey(authKey);
  }

  public getWalletKey(publicKey: Uint8Array): Promise<IWalletKey> {
    return this.keychainRepository.getWalletKey(publicKey);
  }

  public getWalletKeys(): Promise<IWalletKey[]> {
    return this.keychainRepository.getWalletKeys();
  }

  public async getWalletWalletKeys(address: Uint8Array): Promise<IWalletKey[]> {
    return this.keychainRepository.getWalletWalletKeys(address);
  }

  public async getWalletPrivateKey(address: Uint8Array): Promise<Uint8Array> {
    const walletKey =
      await this.keychainRepository.getWalletKeyFromAddress(address);
    const privateKey = await this.platformEncryptedStoreService.getItem(
      Buffer.from(walletKey.publicKey).toString('hex').toUpperCase(),
    );
    if (!privateKey) {
      throw new Error('private key not found');
    }
    return new Uint8Array(Buffer.from(privateKey, 'hex'));
  }
}

export default KeychainService;
