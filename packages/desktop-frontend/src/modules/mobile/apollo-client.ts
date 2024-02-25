import { ApolloClient, InMemoryCache } from '@apollo/client';
import IpcLink from './IpcLink';

const ipcLink = new IpcLink();

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ipcLink,
});

export default apolloClient;
