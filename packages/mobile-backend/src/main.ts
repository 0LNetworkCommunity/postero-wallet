global.Buffer = global.Buffer || require('buffer').Buffer;

import "fast-text-encoding";
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Module, DynamicModule, INestApplication } from '@nestjs/common';
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
import TransfersModule from './transfers/TransfersModule';
import { DocumentNode } from "graphql";

export * from './platform/platform-types';
export * from './platform/interfaces';

export enum BackendEvent {
  SubscriptionData = 'SubscriptionData',
}

export class Backend {
  private readonly app: INestApplication;

  private graphqlService: IGraphQLService;

  private eventEmitter = new Emittery();

  public static async create(
    platformServices: Pick<DynamicModule, 'providers' | 'exports'>,
  ): Promise<Backend> {
    @Module({
      imports: [
        PlatformModule.forRoot(platformServices),
        GraphQLModule,
        WalletsModule,
        TransfersModule,
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

  public execute(operation: {
    operationName: string;
    variables?: {
      readonly [variable: string]: unknown;
    };
    query: DocumentNode;
  }): Promise<any> {
    return this.graphqlService.execute(operation);
  }

  public subscribe(operation: any): Promise<string> {
    return this.graphqlService.subscribe(operation);
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
): Promise<Backend> => {
  return Backend.create(platformServices);
};

export default bootstrap;
