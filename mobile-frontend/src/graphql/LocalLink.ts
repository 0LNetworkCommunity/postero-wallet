import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from "@apollo/client";
import { Backend } from "@postero/core";

class LocalLink extends ApolloLink {
  public constructor(private readonly backend: Backend) {
    super();
  }

  public request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> | null {
    return new Observable((observer) => {
      setTimeout(() => {
        this.backend
          .execute(operation)
          .then((data) => {
            if (data.kind === "single") {
              observer.next(data.singleResult);
              observer.complete();
            } else {
              console.error("unsupported graphql response", data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, 0);
    });
  }
}

export default LocalLink;
