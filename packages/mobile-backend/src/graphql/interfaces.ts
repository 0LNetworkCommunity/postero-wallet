import { UnsubscribeFn } from "emittery";
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import ApolloDriver from "./apollo.driver";

export enum GraphQLServiceEvent {
  SubscriptionData = 'SubscriptionData',
}

export type SubscriptionEvent = {
  subscriptionId: string,
  result: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>,
}

export interface IGraphQLService {
  registerGraphQLServer(graphqlServer: ApolloDriver): void;

  execute(operation: any): Promise<any>;
  subscribe(operation: any): Promise<string>;
  unsubscribe(subscriptionId: string): void;

  on(
    event: GraphQLServiceEvent.SubscriptionData,
    listener: (eventData: SubscriptionEvent) => void | Promise<void>,
  ): UnsubscribeFn;
}
