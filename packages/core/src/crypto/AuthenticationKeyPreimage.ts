import { Scheme } from "./schemes";

class AuthenticationKeyPreimage {
  public readonly bytes: Uint8Array;

  public static ed25519(publicKey: Uint8Array): AuthenticationKeyPreimage {
    return new AuthenticationKeyPreimage(publicKey, Scheme.Ed25519);
  }

  public constructor(publicKey: Uint8Array, scheme: Scheme) {
    const s = Buffer.alloc(1);
    s.writeUInt8(scheme);

    this.bytes = new Uint8Array(Buffer.concat([publicKey, s]));
  }
}

export default AuthenticationKeyPreimage;
