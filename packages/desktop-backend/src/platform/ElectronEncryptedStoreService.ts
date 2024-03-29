import {
  PlatformEncryptedStoreService,
  EncryptedStoreRule,
} from "@postero/mobile-backend";

class ElectronEncryptedStoreService implements PlatformEncryptedStoreService {
  public async setItem(
    key: string,
    value: string,
    rule: EncryptedStoreRule,
  ): Promise<void> {
    throw new Error("unimplemented");
  }

  public async getItem(key: string): Promise<string | null> {
    throw new Error("unimplemented");
  }

  public deleteItem(key: string): Promise<void> {
    throw new Error("unimplemented");
  }
}

export default ElectronEncryptedStoreService;
