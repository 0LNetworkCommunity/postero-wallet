import { v4 as uuid } from "uuid";
import { Inject, Injectable } from "@nestjs/common";
import Bluebird from "bluebird";

import {
  IPendingTransaction,
  IPendingTransactionFactory,
  IPendingTransactionsRepository,
  RawPendingTransactionPayloadType,
} from "./interfaces";
import { Types } from "../types";
import { IDbService } from "../db/interfaces";
import { IDApp, IDAppService } from "../dapps/interfaces";

@Injectable()
class PendingTransactionsRepository implements IPendingTransactionsRepository {
  @Inject(Types.IDbService)
  private dbService: IDbService;

  @Inject(Types.IPendingTransactionFactory)
  private pendingTransactionFactory: IPendingTransactionFactory;

  @Inject(Types.IDAppService)
  private dAppService: IDAppService;

  public async createPendingTransaction(
    dApp: IDApp,
    type: RawPendingTransactionPayloadType,
    payload: Buffer,
  ): Promise<IPendingTransaction> {
    const id = uuid();
    const createdAt = new Date();

    await this.dbService.db("pendingTransactions").insert({
      id,
      dAppId: dApp.id,
      type,
      payload,
      createdAt: createdAt.toISOString(),
    });

    const pendingTransaction =
      await this.pendingTransactionFactory.getPendingTransaction(
        id,
        dApp,
        type,
        payload,
        createdAt,
      );

    return pendingTransaction;
  }

  public async getPendingTransaction(
    id: string,
  ): Promise<IPendingTransaction | null> {
    const row = await this.dbService
      .db("pendingTransactions")
      .where("id", id)
      .first();
    if (!row) {
      return null;
    }

    const dApp = await this.dAppService.getDApp(row.dAppId);
    return this.pendingTransactionFactory.getPendingTransaction(
      row.id,
      dApp!,
      row.type as RawPendingTransactionPayloadType,
      row.payload,
      new Date(row.createdAt),
    );
  }

  public async getPendingTransactions(): Promise<IPendingTransaction[]> {
    const rows = await this.dbService.db("pendingTransactions");
    const dAppIds = rows.map((row) => row.dAppId);
    const dApps = await this.dAppService.getDAppsById(dAppIds);

    return Bluebird.map(rows, async (row) => {
      const dApp = dApps.find((it) => it.id === row.dAppId)!;

      return this.pendingTransactionFactory.getPendingTransaction(
        row.id,
        dApp,
        row.type as RawPendingTransactionPayloadType,
        row.payload,
        new Date(row.createdAt),
      );
    });
  }

  public async removePendingTransaction(id: string): Promise<void> {
    await this.dbService
      .db("pendingTransactions")
      .where("id", id)
      .del();
  }
}

export default PendingTransactionsRepository;
