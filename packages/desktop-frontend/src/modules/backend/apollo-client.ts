import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import IpcLink from './IpcLink';
import SubscriptionLink from './SubscriptionLink';

const ipcLink = new IpcLink();
const subscriptionLink = new SubscriptionLink();

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  subscriptionLink,
  ipcLink,
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

export default apolloClient;
