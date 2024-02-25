import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import {
  IBrowserTabFactory,
  IBrowserBridge,
  IBrowserTab,
} from "./interfaces";
import { Types } from "../types";

@Injectable()
class BrowserTabFactory implements IBrowserTabFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createBrowserTab(
    id: number,
    bridge: IBrowserBridge,
    initialUrl: string,
  ): Promise<IBrowserTab> {
    const browserTab = await this.moduleRef.resolve<IBrowserTab>(
      Types.IBrowserTab,
    );
    browserTab.init(id, bridge, initialUrl);
    return browserTab;
  }
}

export default BrowserTabFactory;
