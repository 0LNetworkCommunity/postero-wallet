import { Socket } from "node:net";

import { WebSocket } from "ws";
import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { IBrowserBridgeFactory, IBrowserBridge } from "./interfaces";
import { Types } from "../types";

@Injectable()
class BrowserBridgeFactory implements IBrowserBridgeFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createBrowserBridge(
    bridgeId: number,
    socket: Socket,
    webSocket: WebSocket,
  ): Promise<IBrowserBridge> {
    const browserBridge = await this.moduleRef.resolve<IBrowserBridge>(
      Types.IBrowserBridge,
    );
    browserBridge.init(bridgeId, socket, webSocket);
    return browserBridge;
  }
}

export default BrowserBridgeFactory;
