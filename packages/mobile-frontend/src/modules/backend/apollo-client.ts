import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { Backend } from "@postero/core";
import LocalLink from "./LocalLink";
import SubscriptionLink from "./SubscriptionLink";

export const getApolloClient = (backend: Backend) => {
  const localLink = new LocalLink(backend);
  const subscriptionLink = new SubscriptionLink(backend);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    subscriptionLink,
    localLink
  );

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    }
  });

  return apolloClient;
};
