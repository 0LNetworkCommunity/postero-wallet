import pathUtil from 'node:path';
import fs from 'node:fs';

import { app } from 'electron';
import knex, { Knex } from 'knex';

import { IDbService } from "./interfaces";
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
class DbService implements IDbService, OnModuleInit, OnModuleDestroy {
  public db!: Knex;

  public async onModuleInit() {
    await this.init();
  }

  public async onModuleDestroy() {
    await this.destroy();
  }

  private async init(): Promise<void> {
    const userDataPath = pathUtil.join(app.getPath('userData'), 'postero');

    await fs.promises.mkdir(userDataPath, { recursive: true, mode: 0o700 });

    const dbPath = pathUtil.join(userDataPath, 'store.db');
    console.log(`db path = "${dbPath}"`);

    // DB file created by sqlite3 has to permissive mode.
    // We create the db file to set the file mode.
    try {
      await fs.promises.stat(dbPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const fd = await fs.promises.open(dbPath, 'w', 0o600);
        await fd.close();
      } else {
        throw err;
      }
    }

    this.db = knex({
      client: "better-sqlite3",
      connection: {
        filename: dbPath,
      },
    });

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
        "privateKey" BLOB NOT NULL,
        "authenticationKey" BLOB NOT NULL,
        "address" BLOB NOT NULL
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
