import crypto from "node:crypto";
import { Injectable } from "@nestjs/common";
import { Wordlist, LangEn, Mnemonic } from "ethers";
import { ed25519 } from "@noble/curves/ed25519";

import AuthenticationKey from "./AuthenticationKey";
import WalletLibrary from "./WalletLibrary";
import AccountAddress from "./AccountAddress";
import { CryptoWallet, ICryptoService } from "./interfaces";

@Injectable()
class CryptoService implements ICryptoService {
  private static MNEMONIC_DEFAULT_PATH = "m/44'/637'/0'/0'/0'";

  public async walletFromMnemonic(mnemonic: string): Promise<CryptoWallet> {
    const [authenticationKey, accountAddress, walletLib] =
      this.getAccountFromMnem(mnemonic);

    const privateKey = walletLib.getPrivateKey(accountAddress);
    const publicKey = ed25519.getPublicKey(privateKey);

    return {
      mnemonic,
      privateKey,
      publicKey,
      authenticationKey,
      accountAddress,
    };
  }

  public createRandom(
    password?: string,
    path?: string,
    wordlist?: Wordlist,
  ): string {
    if (password == null) {
      password = "";
    }
    if (path == null) {
      path = CryptoService.MNEMONIC_DEFAULT_PATH;
    }
    if (wordlist == null) {
      wordlist = LangEn.wordlist();
    }
    const rand = crypto.randomBytes(32);
    const mnemonic = Mnemonic.fromEntropy(
      rand,
      password,
      wordlist,
    );
    return mnemonic.phrase;
  }

  public getAccountFromMnem(
    mnemonic: string,
  ): [AuthenticationKey, AccountAddress, WalletLibrary] {
    const wallet = WalletLibrary.newFromMnemonic(mnemonic);
    const [authKey] = wallet.newAddress();
    const account = authKey.derivedAddress();
    return [authKey, account, wallet];
  }

  public async newWallet(): Promise<CryptoWallet> {
    const mnemonic = this.createRandom();
    return this.walletFromMnemonic(mnemonic);
  }
}

export default CryptoService;
