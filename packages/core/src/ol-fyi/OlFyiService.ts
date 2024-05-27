import { Injectable } from '@nestjs/common';
import { createClient, Client } from 'graphql-ws';
import { IOlFyiService } from './interfaces';

@Injectable()
export class OlFyiService implements IOlFyiService {
  public readonly wsGraphql: Client;

  public constructor() {
    this.wsGraphql = createClient({
      // url: 'ws://localhost:3000/graphql',
      url: 'wss://api.0l.fyi/graphql',
      webSocketImpl: WebSocket,
    });
  }
}
