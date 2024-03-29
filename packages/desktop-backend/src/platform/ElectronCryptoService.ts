import { randomBytes, randomUUID } from "node:crypto";
import { PlatformCryptoService } from "@postero/core";

class ElectronCryptoService implements PlatformCryptoService {
  public getRandomBytes(byteCount: number): Uint8Array {
    return randomBytes(byteCount);
  }

  public randomUUID() {
    return randomUUID();
  }
}

export default ElectronCryptoService;
