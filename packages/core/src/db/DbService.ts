import knex, { Knex } from 'knex';

import { IDbService } from "./interfaces";
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PlatformTypes } from '../platform/platform-types';
import { PlatformSqliteService } from '../platform/interfaces';

@Injectable()
class DbService implements IDbService, OnModuleInit, OnModuleDestroy {
  public db!: Knex;

  @Inject(PlatformTypes.SqliteService)
  private readonly platformSqliteService: PlatformSqliteService;

  public async onModuleInit() {
    await this.init();
  }

  public async onModuleDestroy() {
    await this.destroy();
  }

  public raw<T = any>(value: Knex.Value): Knex.Raw<T> {
    if (Buffer.isBuffer(value)) {
      return this.db.raw(`X'${value.toString('hex')}'`);
    }
    if (value instanceof Uint8Array) {
      return this.db.raw(`X'${Buffer.from(value).toString('hex')}'`);
    }
    return this.db.raw<T>(value);
  }

  private async init(): Promise<void> {
    const knexConfig = await this.platformSqliteService.getKnexConfig();
    this.db = knex(knexConfig);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "coins" (
        "id" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "decimals" INTEGER NOT NULL,
        "symbol" TEXT NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "wallets" (
        "address" BLOB PRIMARY KEY,
        "label" TEXT
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "walletsAuthKeys" (
        "walletAddress" BLOB NOT NULL REFERENCES wallets(address) ON DELETE CASCADE,
        "authKey" BLOB NOT NULL,
        PRIMARY KEY("walletAddress", "authKey")
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "slowWallets" (
        "walletAddress" BLOB PRIMARY KEY REFERENCES wallets(address) ON DELETE CASCADE,
        "transferred" TEXT NOT NULL,
        "unlocked" TEXT NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "balances" (
        "coinId" TEXT NOT NULL REFERENCES coins(id),
        "walletAddress" BLOB NOT NULL REFERENCES wallets(address) ON DELETE CASCADE,
        "amount" TEXT NOT NULL,
        PRIMARY KEY("coinId", "walletAddress")
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "movements" (
        "version" TEXT NOT NULL,
        "walletAddress" BLOB NOT NULL REFERENCES wallets(address) ON DELETE CASCADE,
        "lockedBalance" TEXT NOT NULL,
        "balance" TEXT NOT NULL,
        "lockedAmount" TEXT NOT NULL,
        "unlockedAmount" TEXT NOT NULL,
        PRIMARY KEY("version", "walletAddress")
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "dApps" (
        "id" TEXT PRIMARY KEY,
        "host" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" BLOB
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "pendingTransactions" (
        "hash" BLOB NOT NULL PRIMARY KEY,
        "status" TEXT NOT NULL,
        "sender" BLOB NOT NULL,
        "payload" BLOB NOT NULL,
        "maxGasUnit" INTEGER NOT NULL,
        "gasPrice" INTEGER NOT NULL,
        "expirationTimestamp"  INTEGER NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "blockMetadataTransaction" (
        "version" TEXT PRIMARY KEY,
        "hash" BLOB NOT NULL,
        "epoch" TEXT NOT NULL,
        "timestamp" INTEGER NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "genesisTransaction" (
        "version" TEXT PRIMARY KEY,
        "hash" BLOB NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "userTransaction" (
        "version" TEXT PRIMARY KEY,
        "success" INTEGER NOT NULL,
        "sender" BLOB NOT NULL,
        "hash" BLOB NOT NULL,
        "moduleAddress" BLOB NOT NULL,
        "moduleName" TEXT NOT NULL,
        "functionName" TEXT NOT NULL,
        "arguments" TEXT NOT NULL,
        "timestamp" INTEGER NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "scriptUserTransaction" (
        "version" TEXT PRIMARY KEY,
        "hash" BLOB NOT NULL,
        "success" INTEGER,
        "sender" BLOB NOT NULL,
        "timestamp" INTEGER NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "keys" (
        "publicKey" BLOB PRIMARY KEY,
        "authKey" BLOB
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT
      )
    `);
  }

  private destroy() {
    return this.db.destroy();
  }
}

export default DbService;
