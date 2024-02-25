import { IWindow } from "../window-manager/interfaces";
import ApolloDriver from "./apollo.driver";

export interface IGraphQLService {
  registerGraphQLServer(graphqlServer: ApolloDriver): void;

  execute(operation: any, window: IWindow): Promise<any>;
  subscribe(operation: any, window: IWindow): Promise<string>;
  unsubscribe(subscriptionId: string): void;
}
