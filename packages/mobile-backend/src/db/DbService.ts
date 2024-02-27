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
        "id" TEXT PRIMARY KEY,
        "label" TEXT,
        "publicKey" BLOB NOT NULL,
        "authenticationKey" BLOB NOT NULL,
        "address" BLOB NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "slow_wallets" (
        "walletId" TEXT PRIMARY KEY REFERENCES wallets(id) ON DELETE CASCADE,
        "transferred" TEXT NOT NULL,
        "unlocked" TEXT NOT NULL
      )
    `);

    await this.db.raw(`
      CREATE TABLE IF NOT EXISTS "balances" (
        "coinId" TEXT NOT NULL REFERENCES coins(id),
        "walletId" TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
        "amount" TEXT NOT NULL,
        PRIMARY KEY("coinId", "walletId")
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
        "id" TEXT PRIMARY KEY,
        "dAppId" TEXT NOT NULL REFERENCES dApps(id),
        "type" TEXT NOT NULL,
        "payload" BLOB NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `);
  }

  private destroy() {
    return this.db.destroy();
  }
}

export default DbService;
