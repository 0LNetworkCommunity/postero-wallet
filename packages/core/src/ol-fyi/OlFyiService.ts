import { Injectable } from '@nestjs/common';
import { createClient, Client } from 'graphql-ws';
import { IOlFyiService } from './interfaces';

@Injectable()
export class OlFyiService implements IOlFyiService {
  public readonly wsGraphql: Client;

  public constructor() {
    this.wsGraphql = createClient({
      // url: 'ws://localhost:3000/graphql',
      // url: 'ws://192.168.1.159:3000/graphql',
      url: 'wss://api.0l.fyi/graphql',
      webSocketImpl: WebSocket,
      retryAttempts: 1_000_000,

      // on: {
      //   closed(event) {
      //     console.log('closed', event);
      //   },
      //   connected(socket, payload, wasRetry) {
      //     console.log('connected', socket, payload, wasRetry);
      //   },
      //   connecting(isRetry) {
      //     console.log('connecting', isRetry);
      //   },
      //   error(error) {
      //     console.log('error', error);
      //   },
      //   message(message) {
      //     console.log('message', message);
      //   },
      //   opened(socket) {
      //     console.log('socket', socket);
      //   },
      //   ping(received, payload) {
      //     console.log('ping', received, payload);

      //   },
      //   pong(received, payload) {
      //     console.log('pong', received, payload);
      //   }

      // },
    });
  }
}
