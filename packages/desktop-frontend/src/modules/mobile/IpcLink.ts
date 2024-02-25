import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from "@apollo/client";

class IpcLink extends ApolloLink {

  public request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> | null {
    console.log('>>', operation);

    return new Observable((observer) => {
      // this.ipcRenderer
      //   .invoke(IpcMethod.GraphQLExecute, operation)
      //   .then((data) => {
      //     if (data.kind === 'single') {
      //       observer.next(data.singleResult);
      //       observer.complete();
      //     } else {
      //       console.error('unsupported graphql response', data);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    });
  }
}

export default IpcLink;
