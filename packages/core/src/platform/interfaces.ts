import { Knex } from 'knex';
import { UnsubscribeFn } from 'emittery';
import { IpcMethod } from '../ipc/methods';
import { WindowType } from '../window-manager/types';

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

export interface LocalAuthenticationService {
  authenticate(): Promise<boolean>;
}

export interface PlatformWindowManagerService {
  createWindow(type: WindowType, params?: any, parent?: any): Promise<any>;
}

export interface PlatformBrowserLinkService {

}

export interface PlatformSvgCleanerService {
  clean(svgImg: string): string;
}