import { IncomingMessage } from 'node:http';

import { Inject, Injectable } from "@nestjs/common";
import { WebSocketServer, WebSocket } from 'ws';
import { ModuleRef } from "@nestjs/core";

import { Types, IBrowserBridge } from "@postero/mobile-backend";
import ElectronBrowserBridge from './ElectronBrowserBridge';

@Injectable()
class ElectronBrowserLinkService {
  @Inject()
  private readonly moduleRef: ModuleRef;

  private bridgeId = 0;

  private readonly bridges: IBrowserBridge[] = [];

  public constructor() {
    const server = new WebSocketServer({ port: 9292 });

    server.on("connection", (webSocket, req) =>
      this.onConnection(webSocket, req),
    );
  }

  private async onConnection(webSocket: WebSocket, req: IncomingMessage) {
    const bridgeId = this.bridgeId++;

    const bridge = await this.moduleRef.resolve<ElectronBrowserBridge>(
      Types.IBrowserBridge,
    );
    bridge.init(bridgeId, req.socket, webSocket);
    this.bridges.push(bridge);

    console.log(`new connection ${req.socket.remoteAddress}`);
  }
}

export default ElectronBrowserLinkService;
