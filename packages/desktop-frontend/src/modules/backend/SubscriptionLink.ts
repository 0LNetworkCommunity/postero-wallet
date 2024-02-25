import {
  ApolloLink,
  Operation,
  Observable,
  Observer,
  FetchResult,
  RequestHandler,
} from "@apollo/client";
import { IpcMethod } from "./ipc";
import IpcRenderer from "./ipc-renderer";

class SubscriptionLink extends ApolloLink {
  private ipcRenderer: IpcRenderer = (window as any).electron.ipcRenderer;

  private observers = new Map<string, Observer<FetchResult>>();

  public constructor(request?: RequestHandler) {
    super(request);

    this.ipcRenderer.on("graphql_event", (data) => {
      const event = data as { subscriptionId: string; result: any };
      const observer = this.observers.get(event.subscriptionId);
      if (observer) {
        observer.next!(event.result);
      }
    });
  }

  public request(operation: Operation): Observable<FetchResult> {
    return this.subscribe(operation);
  }

  private subscribe(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      let subscribed = true;
      let subscriptionId: string | undefined;

      this.ipcRenderer
        .invoke(IpcMethod.GraphQLSubscribe, operation)
        .then((subId) => {
          if (!subscribed) {
            this.unsubscribe(subId);
          } else {
            subscriptionId = subId;
            this.observers.set(subId, observer);
          }
        });

      return () => {
        subscribed = false;
        if (subscriptionId) {
          this.unsubscribe(subscriptionId);
        }
      };
    });
  }

  private unsubscribe(subscriptionId: string) {
    this.observers.delete(subscriptionId);
    this.ipcRenderer
      .invoke(IpcMethod.GraphQLUnsubscribe, subscriptionId)
      .catch((error) => {
        console.error(error);
      });
  }
}

export default SubscriptionLink;
