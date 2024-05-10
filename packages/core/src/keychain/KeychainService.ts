import { Inject, Injectable } from '@nestjs/common';
import { IKeychainRepository, IKeychainService } from './interfaces';
import { mnemonicToPrivateKey, privateKeyToPublicKey, publicKeyToAuthKey } from '../crypto';
import { Types } from '../types';
import { PlatformTypes } from '../platform/platform-types';
import { EncryptedStoreRule, PlatformEncryptedStoreService } from "../platform/interfaces";
import { WalletKey } from './types';

@Injectable()
class KeychainService implements IKeychainService {
  @Inject(Types.IKeychainRepository)
  private readonly keychainRepository: IKeychainRepository;

  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  public async newKeyFromMnemonic(mnemonic: string): Promise<WalletKey> {
    const privateKey = mnemonicToPrivateKey(mnemonic);
    return this.newKeyFromPrivateKey(privateKey);
  }

  public async newKeyFromPrivateKey(privateKey: Uint8Array): Promise<WalletKey> {
    const publicKey = privateKeyToPublicKey(privateKey);
    const authKey = publicKeyToAuthKey(publicKey);

    await this.keychainRepository.saveKey(publicKey, authKey);

    await this.platformEncryptedStoreService.setItem(
      Buffer.from(publicKey).toString('hex').toUpperCase(),
      Buffer.from(privateKey).toString('hex').toUpperCase(),
      EncryptedStoreRule.WhenUnlockedThisDeviceOnly,
    );
    return { publicKey, authKey };
  }

}

export default KeychainService;
