import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { DAppEntity, IDApp, IDAppFactory } from "./interfaces";
import { Types } from "../types";

@Injectable()
class DAppFactory implements IDAppFactory {
  private readonly dApps = new Map<number, IDApp>();

  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getDApp(entity: DAppEntity): Promise<IDApp> {
    let dApp = this.dApps.get(entity.id);
    if (!dApp) {
      dApp = await this.moduleRef.resolve<IDApp>(Types.IDApp);
      dApp.init(entity);
      this.dApps.set(entity.id, dApp);
    }
    return dApp;
  }
}

export default DAppFactory;
