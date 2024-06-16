global.Buffer = global.Buffer || require('buffer').Buffer;

import 'fast-text-encoding';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  Module,
  DynamicModule,
  INestApplication,
  Type,
  ForwardReference,
} from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import Emittery, { UnsubscribeFn } from 'emittery';

import {
  GraphQLServiceEvent,
  IGraphQLService,
  SubscriptionEvent,
} from './graphql/interfaces';
import { Types } from './types';
import WalletsModule from './wallets/WalletsModule';
import { GraphQLModule } from './graphql/graphql.module';
import { PlatformModule } from './platform/PlatformModule';
import { DocumentNode } from 'graphql';

import { IWindow } from './window-manager/interfaces';

export * from './platform/platform-types';
export * from './platform/interfaces';
export * from './ipc/methods';
export * from './types';
export * from './window-manager/interfaces';
export * from './window-manager/AbstractWindow';
export * from './window-manager/types';
export * from './graphql/interfaces';
export * from './wallets/interfaces';

export enum BackendEvent {
  SubscriptionData = 'SubscriptionData',
}

export class Backend {
  public readonly app: INestApplication;

  private graphqlService: IGraphQLService;

  private eventEmitter = new Emittery();

  public static async create(
    platformServices: Pick<DynamicModule, 'providers' | 'exports'>,

    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): Promise<Backend> {
    @Module({
      imports: [
        PlatformModule.forRoot(platformServices),
        WalletsModule,
        GraphQLModule,
        ...(imports ?? []),
      ],
      providers: [],
    })
    class AppModule {}

    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      {
        abortOnError: false,
      },
    );
    await app.init();

    return new Backend(app);
  }

  private constructor(app: INestApplication) {
    this.app = app;

    const gqlModule =
      app.get<NestGraphQLModule<ApolloDriver>>(NestGraphQLModule);
    const apolloServer = gqlModule.graphQlAdapter;

    const graphqlService = app.get<IGraphQLService>(Types.IGraphQLService);
    graphqlService.registerGraphQLServer(apolloServer);
    this.graphqlService = graphqlService;

    this.graphqlService.on(GraphQLServiceEvent.SubscriptionData, (data) => {
      this.eventEmitter.emit(BackendEvent.SubscriptionData, data);
    });
  }

  public execute(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow | undefined,
  ): Promise<any> {
    return this.graphqlService.execute(operation, window);
  }

  public subscribe(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow | undefined,
  ): Promise<string> {
    return this.graphqlService.subscribe(operation, window);
  }

  public unsubscribe(subscriptionId: string) {
    return this.graphqlService.unsubscribe(subscriptionId);
  }

  public on(
    event: BackendEvent.SubscriptionData,
    listener: (eventData: SubscriptionEvent) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }
}

const bootstrap = async (
  platformServices: Pick<DynamicModule, 'providers' | 'exports'>,
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >,
): Promise<Backend> => {
  return Backend.create(platformServices, imports);
};

export default bootstrap;
