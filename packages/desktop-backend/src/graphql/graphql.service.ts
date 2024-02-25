import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { Repeater } from "@repeaterjs/repeater";
import { DocumentNode, ExecutionResult, subscribe } from "graphql";
import { ObjMap } from "graphql/jsutils/ObjMap";

import { IWindow } from "../window-manager/interfaces";
import ApolloDriver from "./apollo.driver";
import { IGraphQLService } from "./interfaces";
import { WindowEvent } from "../window-manager/types";

@Injectable()
export class GraphQLService implements IGraphQLService {
  private graphqlServer?: ApolloDriver;

  private subscriptions = new Map<string, () => void>();

  public async registerGraphQLServer(graphqlServer: ApolloDriver) {
    this.graphqlServer = graphqlServer;
  }

  public async execute(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow,
  ): Promise<any> {
    const res = await this.graphqlServer!.instance.executeOperation(operation, {
      contextValue: window,
    });
    return res.body;
  }

  public async subscribe(
    operation: {
      operationName: string;
      variables?: {
        readonly [variable: string]: unknown;
      };
      query: DocumentNode;
    },
    window: IWindow,
  ) {
    const subscriptionId = uuid();

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

    const windowClosePromise = new Promise<void>((resolve) => {
      window.on(WindowEvent.Close, () => resolve());
    });

    setTimeout(async () => {
      for await (const value of Repeater.race([
        sub,
        disconnectPromise,
        windowClosePromise,
      ])) {
        if (!value) {
          return;
        }
        window.window?.webContents.send("graphql_event", {
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
}
