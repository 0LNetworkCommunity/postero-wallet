import { ApolloClient, InMemoryCache } from '@apollo/client';
import IpcLink from './IpcLink';

const ipcLink = new IpcLink();

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ipcLink,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default apolloClient;
