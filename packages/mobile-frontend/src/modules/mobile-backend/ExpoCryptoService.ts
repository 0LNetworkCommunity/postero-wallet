import * as Crypto from "expo-crypto";
import { PlatformCryptoService } from "@postero/mobile-backend";

class ExpoCryptoService implements PlatformCryptoService {
  public getRandomBytes(byteCount: number): Uint8Array {
    return Crypto.getRandomBytes(byteCount);
  }

  public randomUUID() {
    return Crypto.randomUUID();
  }
}

export default ExpoCryptoService;
