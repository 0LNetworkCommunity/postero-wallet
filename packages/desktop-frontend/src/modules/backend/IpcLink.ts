import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from "@apollo/client";
import { IpcMethod } from "./ipc";
import IpcRenderer from "./ipc-renderer";

class IpcLink extends ApolloLink {

  private ipcRenderer: IpcRenderer = (window as any).electron.ipcRenderer;

  public request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> | null {
    return new Observable((observer) => {
      this.ipcRenderer
        .invoke(IpcMethod.GraphQLExecute, operation)
        .then((data) => {
          if (data.kind === 'single') {
            observer.next(data.singleResult);
            observer.complete();
          } else {
            console.error('unsupported graphql response', data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

export default IpcLink;
