import {
  PlatformEncryptedStoreService,
  EncryptedStoreRule,
} from "@postero/mobile-backend";

import * as SecureStore from "expo-secure-store";

class ExpoEncryptedStoreService implements PlatformEncryptedStoreService {
  private static RULES = new Map<EncryptedStoreRule, number>([
    [EncryptedStoreRule.AfterFirstUnlock, SecureStore.AFTER_FIRST_UNLOCK],
    [
      EncryptedStoreRule.AfterFirstUnlockThisDeviceOnly,
      SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    ],
    [EncryptedStoreRule.Always, SecureStore.ALWAYS],
    [
      EncryptedStoreRule.AlwaysThisDeviceOnly,
      SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    ],
    [
      EncryptedStoreRule.WhenPasscodeSetThisDeviceOnly,
      SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    ],
    [EncryptedStoreRule.WhenUnlocked, SecureStore.WHEN_UNLOCKED],
    [
      EncryptedStoreRule.WhenUnlockedThisDeviceOnly,
      SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    ],
  ]);

  public async setItem(
    key: string,
    value: string,
    rule: EncryptedStoreRule
  ): Promise<void> {
    return SecureStore.setItem(key, value, {
      keychainAccessible: ExpoEncryptedStoreService.RULES.get(rule)!,
    });
  }

  public async getItem(key: string): Promise<string | null> {
    return SecureStore.getItem(key);
  }

  public deleteItem(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }
}

export default ExpoEncryptedStoreService;
