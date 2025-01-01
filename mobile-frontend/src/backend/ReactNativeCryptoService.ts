import * as Crypto from "expo-crypto";
import { PlatformCryptoService } from "@postero/core";

class ReactNativeCryptoService implements PlatformCryptoService {
  public getRandomBytes(byteCount: number): Uint8Array {
    return Crypto.getRandomBytes(byteCount);
  }

  public randomUUID() {
    return Crypto.randomUUID();
  }
}

export default ReactNativeCryptoService;
