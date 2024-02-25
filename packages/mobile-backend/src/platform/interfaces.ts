import { Knex } from 'knex';

export interface PlatformCryptoService {
  getRandomBytes(byteCount: number): Uint8Array;
  randomUUID(): string;
}

export interface PlatformSqliteService {
  getKnexConfig(): Promise<Knex.Config>;
}

export enum EncryptedStoreRule {
  AfterFirstUnlock,
  AfterFirstUnlockThisDeviceOnly,
  Always,
  AlwaysThisDeviceOnly,
  WhenPasscodeSetThisDeviceOnly,
  WhenUnlocked,
  WhenUnlockedThisDeviceOnly,
}

export interface PlatformEncryptedStoreService {
  setItem(key: string, value: string, rule: EncryptedStoreRule): Promise<void>;
  getItem(key: string): Promise<string | null>;
  deleteItem(key: string): Promise<void>;
}
