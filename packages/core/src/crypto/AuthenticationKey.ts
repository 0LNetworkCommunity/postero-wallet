import { sha3_256 } from "@noble/hashes/sha3";

import AccountAddress from "./AccountAddress";
import AuthenticationKeyPreimage from "./AuthenticationKeyPreimage";

class AuthenticationKey {
  private static LENGTH = 32;

  public readonly bytes: Uint8Array;

  public static ed25519(publicKey: Uint8Array): AuthenticationKey {
    return AuthenticationKey.fromPreImage(
      AuthenticationKeyPreimage.ed25519(publicKey),
    );
  }

  public static fromPreImage(
    preImage: AuthenticationKeyPreimage,
  ): AuthenticationKey {
    return new AuthenticationKey(sha3_256(preImage.bytes));
  }

  public constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  public derivedAddress(): AccountAddress {
    return new AccountAddress(
      this.bytes.slice(AuthenticationKey.LENGTH - AccountAddress.LENGTH),
    );
  }
}

export default AuthenticationKey;
