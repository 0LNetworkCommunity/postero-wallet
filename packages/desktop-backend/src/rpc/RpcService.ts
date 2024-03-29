import { IncomingMessage } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { Inject, Injectable } from '@nestjs/common';

import {
  IBrowserBridge,
  IBrowserBridgeFactory,
  IRpcService,
} from './interfaces';
import { Types } from '../types';

@Injectable()
class RpcService implements IRpcService {
  private bridgeId = 0;

  private readonly bridges: IBrowserBridge[] = [];

  public constructor(
    @Inject(Types.IBrowserBridgeFactory)
    private readonly browserBridgeFactory: IBrowserBridgeFactory,
  ) {
    const server = new WebSocketServer({ port: 9292 });

    server.on('connection', (webSocket, req) =>
      this.onConnection(webSocket, req),
    );
  }

  private async onConnection(webSocket: WebSocket, req: IncomingMessage) {
    const bridgeId = this.bridgeId++;

    const bridge = await this.browserBridgeFactory.createBrowserBridge(
      bridgeId,
      req.socket,
      webSocket,
    );
    this.bridges.push(bridge);

    console.log(`new connection ${req.socket.remoteAddress}`);
  }
}

export default RpcService;
