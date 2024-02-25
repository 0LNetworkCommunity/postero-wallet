import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import {
  IConnectionRequestFactory,
  IDApp,
  IConnectionRequest,
} from "./interfaces";
import { IBrowserTab } from "../rpc/interfaces";
import { Types } from "../types";

@Injectable()
class ConnectionRequestFactory implements IConnectionRequestFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getConnectionRequest(
    id: string,
    browserTab: IBrowserTab,
    dApp: IDApp,
  ): Promise<IConnectionRequest> {
    const connectionRequest = await this.moduleRef.resolve<IConnectionRequest>(
      Types.IConnectionRequest,
    );
    connectionRequest.init(id, browserTab, dApp);
    return connectionRequest;
  }
}

export default ConnectionRequestFactory;
