import { toUtf8Bytes } from "ethers";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { sha3_256 } from "@noble/hashes/sha3";

class Seed {
  public static readonly MNEMONIC_SALT_PREFIX = Buffer.from(
    "0L WALLET: UNREST, FIRES, AND VIOLENCE AS PROTESTS RAGE ACROSS US: mnemonic salt prefix$",
    "ascii",
  );

  public readonly seed: Uint8Array;

  public constructor(mnemonic: string, salt: Buffer) {
    const msalt = Buffer.concat([Seed.MNEMONIC_SALT_PREFIX, salt]);
    const password = toUtf8Bytes(mnemonic, "NFKD");

    const seed = pbkdf2(sha3_256, password, msalt, { c: 2048, dkLen: 32 });
    this.seed = seed;
  }
}

export default Seed;
