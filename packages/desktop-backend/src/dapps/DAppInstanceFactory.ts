import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { IDAppInstanceFactory, IDAppInstance, IDApp } from "./interfaces";
import { Types } from "../types";

@Injectable()
class DAppInstanceFactory implements IDAppInstanceFactory {
  private readonly dAppInstances = new Map<string, IDAppInstance>();

  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getDAppInstance(dApp: IDApp): Promise<IDAppInstance> {
    let dAppInstance = this.dAppInstances.get(dApp.id);
    if (!dAppInstance) {
      dAppInstance = await this.moduleRef.resolve<IDAppInstance>(
        Types.IDAppInstance,
      );
      dAppInstance.init(dApp);

      this.dAppInstances.set(dApp.id, dAppInstance);

      dAppInstance.onDeactivate((dAppInstance: IDAppInstance) =>
        this.onDAppInstanceDeactivate(dAppInstance),
      );
    }

    return dAppInstance;
  }

  private onDAppInstanceDeactivate(dAppInstance: IDAppInstance) {
    if (!this.dAppInstances.delete(dAppInstance.dApp.id)) {
      throw new Error("dAppInstance not found in factory");
    }
  }
}

export default DAppInstanceFactory;
