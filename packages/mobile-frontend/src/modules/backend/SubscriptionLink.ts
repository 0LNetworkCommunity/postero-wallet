import {
  ApolloLink,
  Operation,
  Observable,
  Observer,
  FetchResult,
  RequestHandler,
} from "@apollo/client";
import { Backend, BackendEvent } from "@postero/mobile-backend";

class SubscriptionLink extends ApolloLink {
  private observers = new Map<string, Observer<FetchResult>>();

  public constructor(private readonly backend: Backend) {
    super();

    backend.on(BackendEvent.SubscriptionData, (data) => {
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

      this.backend.subscribe(operation).then((subId) => {
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
    this.backend.unsubscribe(subscriptionId);
  }
}

export default SubscriptionLink;
