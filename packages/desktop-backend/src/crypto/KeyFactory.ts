import * as hkdf from '@noble/hashes/hkdf';
import { sha3_256 } from '@noble/hashes/sha3';

import ExtendedPrivKey from "./ExtendedPrivateKey";
import Seed from './Seed';

class KeyFactory {
  private static readonly INFO_PREFIX = Buffer.from("0L WALLET: US DEATHS NEAR 100,000, AN INCALCULABLE LOSS: derived key$", 'ascii');

  private static MAIN_KEY_SALT = Buffer.from(
    "0L WALLET: 30 MILLION AMERICANS HAVE FILED INITIAL UNEMPLOYMENT CLAIMS: master key salt$", 'ascii'
  );

  private readonly main: Uint8Array;

  public constructor(seed: Seed) {
    const hkdfExtract = hkdf.extract(sha3_256, seed.seed, KeyFactory.MAIN_KEY_SALT);
    this.main = hkdfExtract.slice(0, 32);
    console.log('main', Buffer.from(this.main).toString('hex'));
  }

  public privateChild(child: bigint): ExtendedPrivKey {
    const prk = this.main;

    const leN = Buffer.alloc(8);
    leN.writeBigUInt64LE(child);
    let info = Buffer.concat([KeyFactory.INFO_PREFIX, leN]);

    const hkdfExpand = hkdf.expand(sha3_256, prk, info, 32);

    console.log(
      'hkdf.expand',
      Buffer.from(prk).toString('hex'),
      Buffer.from(info).toString('hex'),
      Buffer.from(hkdfExpand).toString('hex'),
    );

    return new ExtendedPrivKey(child, hkdfExpand);
  }
}

export default KeyFactory;
