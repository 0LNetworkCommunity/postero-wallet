import { Injectable, Inject } from '@nestjs/common';
import { Repeater } from '@repeaterjs/repeater';
import Emittery, { UnsubscribeFn } from 'emittery';
import { DocumentNode, ExecutionResult, subscribe } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';

import ApolloDriver from './apollo.driver';
import { GraphQLServiceEvent, IGraphQLService, SubscriptionEvent } from './interfaces';
import { PlatformTypes } from '../platform/platform-types';
import { PlatformCryptoService } from '../platform/interfaces';

@Injectable()
export class GraphQLService implements IGraphQLService {
  @Inject(PlatformTypes.CryptoService)
  private readonly platformCryptoService: PlatformCryptoService;

  private graphqlServer?: ApolloDriver;

  private subscriptions = new Map<string, () => void>();

  private eventEmitter = new Emittery();

  public async registerGraphQLServer(graphqlServer: ApolloDriver) {
    this.graphqlServer = graphqlServer;
  }

  public async execute(operation: {
    operationName: string;
    variables?: {
      readonly [variable: string]: unknown;
    };
    query: DocumentNode;
  }): Promise<any> {
    const res = await this.graphqlServer!.instance.executeOperation(operation, {
      contextValue: window,
    });
    return res.body;
  }

  public async subscribe(operation: {
    operationName: string;
    variables?: {
      readonly [variable: string]: unknown;
    };
    query: DocumentNode;
  }) {
    const subscriptionId = this.platformCryptoService.randomUUID();

    const sub = (await subscribe({
      schema: this.graphqlServer!.schema!,
      operationName: operation.operationName,
      variableValues: operation.variables,
      document: operation.query,
      contextValue: window,
    })) as AsyncGenerator<
      ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>,
      void,
      void
    >;

    const disconnectPromise = new Promise<void>((resolve) => {
      this.subscriptions.set(subscriptionId, resolve);
    });

    setTimeout(async () => {
      for await (const value of Repeater.race([sub, disconnectPromise])) {
        if (!value) {
          return;
        }

        this.eventEmitter.emit(GraphQLServiceEvent.SubscriptionData, {
          subscriptionId,
          result: value,
        });
      }
    }, 0);

    return subscriptionId;
  }

  /**
   * Triggered when the client disposes the graphql subscription
   * @param subscriptionId
   */
  public unsubscribe(subscriptionId: string) {
    const disconnectPromise = this.subscriptions.get(subscriptionId);
    if (disconnectPromise) {
      disconnectPromise();
      this.subscriptions.delete(subscriptionId);
    }
  }

  public on(
    event: GraphQLServiceEvent.SubscriptionData,
    listener: (eventData: SubscriptionEvent) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }
}
