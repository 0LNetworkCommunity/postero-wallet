import { UnsubscribeFn } from 'emittery';
import { DocumentNode, ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import ApolloDriver from './apollo.driver';
import { IWindow } from '../window-manager/interfaces';

export enum GraphQLServiceEvent {
  SubscriptionData = 'SubscriptionData',
}

export type SubscriptionEvent = {
  subscriptionId: string;
  result: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>;
};

export interface IGraphQLService {
  registerGraphQLServer(graphqlServer: ApolloDriver): void;

  execute(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow | undefined,
  ): Promise<any>;

  subscribe(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow | undefined,
  ): Promise<string>;

  unsubscribe(subscriptionId: string): void;

  on(
    event: GraphQLServiceEvent.SubscriptionData,
    listener: (eventData: SubscriptionEvent) => void | Promise<void>,
  ): UnsubscribeFn;
}
