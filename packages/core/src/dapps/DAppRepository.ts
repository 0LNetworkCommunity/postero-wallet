import Bluebird from "bluebird";
import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import {
  DAppEntity,
  DAppMetadata,
  IDApp,
  IDAppFactory,
  IDAppRepository,
} from "./interfaces";
import { IDbService } from "../db/interfaces";
import { Types } from "../types";

@Injectable()
class DAppRepository implements IDAppRepository {
  @Inject(Types.IDbService)
  private readonly dbService!: IDbService;

  @Inject(Types.IDAppFactory)
  private readonly dAppFactory!: IDAppFactory;

  public async getDAppFromHost(host: string): Promise<IDApp | null> {
    const app = await this.dbService.db("dapps").where("host", host).first();
    if (app) {
      return this.dAppFactory.getDApp(app);
    }
    return null;
  }

  public async saveDApp(host: string, metadata: DAppMetadata): Promise<IDApp> {
    const rows = await this.dbService
      .db("dapps")
      .insert({
        id: uuid(),
        host,
        name: metadata.name,
        description: metadata.description,
        icon: metadata.icon,
      })
      .onConflict("host")
      .merge(["name", "description", "icon"])
      .returning("*");
    return this.dAppFactory.getDApp(rows[0]);
  }

  public async getDApp(id: string): Promise<IDApp | null> {
    const dApp: DAppEntity | null = await this.dbService
      .db("dapps")
      .where("id", id)
      .first();
    if (!dApp) {
      return null;
    }
    return this.dAppFactory.getDApp(dApp);
  }

  public async getDApps(): Promise<IDApp[]> {
    const rows: DAppEntity[] = await this.dbService.db("dapps");
    return Bluebird.map(rows, (entity) => this.dAppFactory.getDApp(entity));
  }

  public async getDAppsById(ids: string[]): Promise<IDApp[]> {
    const rows = await this.dbService
      .db("dapps")
      .whereIn('id', ids)
    return Bluebird.map(rows, (entity) => this.dAppFactory.getDApp(entity));
  }

}

export default DAppRepository;
