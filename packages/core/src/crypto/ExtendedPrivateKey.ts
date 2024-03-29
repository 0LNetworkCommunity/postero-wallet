import { ed25519 } from "@noble/curves/ed25519";

import AuthenticationKey from "./AuthenticationKey";

class ExtendedPrivKey {
  private readonly childNumber: bigint;

  private readonly privateKey: Uint8Array;

  public constructor(childNumber: bigint, privateKey: Uint8Array) {
    this.childNumber = childNumber;
    this.privateKey = privateKey;
  }

  public getPublicKey() {
    return ed25519.getPublicKey(this.privateKey);
  }

  // Compute the authentication key for this account's public key
  public getAuthenticationKey() {
    return AuthenticationKey.ed25519(this.getPublicKey());
  }

  public getPrivateKey() {
    return this.privateKey;
  }
}

export default ExtendedPrivKey;
