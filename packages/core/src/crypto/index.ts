import * as hkdf from '@noble/hashes/hkdf';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha3_256 } from '@noble/hashes/sha3';
import { ed25519 } from '@noble/curves/ed25519';

const INFO_PREFIX = Buffer.concat([
  Buffer.from(
    '0L WALLET: US DEATHS NEAR 100,000, AN INCALCULABLE LOSS: derived key$',
    'ascii',
  ),
  Buffer.alloc(8),
]);

const MNEMONIC_SALT_PREFIX = Buffer.from(
  '0L WALLET: UNREST, FIRES, AND VIOLENCE AS PROTESTS RAGE ACROSS US: mnemonic salt prefix$0L',
  'ascii',
);

const MAIN_KEY_SALT = Buffer.from(
  '0L WALLET: 30 MILLION AMERICANS HAVE FILED INITIAL UNEMPLOYMENT CLAIMS: master key salt$',
  'ascii',
);

export function mnemonicToPrivateKey(mnemonic: string): Uint8Array {
  const ikm = pbkdf2(sha3_256, mnemonic, MNEMONIC_SALT_PREFIX, {
    c: 2048,
    dkLen: 32,
  });
  const hkdfExtract = hkdf.extract(sha3_256, ikm, MAIN_KEY_SALT);
  return hkdf.expand(sha3_256, hkdfExtract.slice(0, 32), INFO_PREFIX, 32);
}

export function privateKeyToPublicKey(privateKey: Uint8Array) {
  return ed25519.getPublicKey(privateKey);
}

export function publicKeyToAuthKey(publicKey: Uint8Array): Uint8Array {
  // Concatenate the public key with 0. 0 means Ed25519 which is the only Scheme supported for now.
  return sha3_256(new Uint8Array(Buffer.concat([publicKey, Buffer.from([0])])));
}

export function mnemonicToAuthKey(mnemonic: string) {
  return publicKeyToAuthKey(
    privateKeyToPublicKey(mnemonicToPrivateKey(mnemonic)),
  );
}
