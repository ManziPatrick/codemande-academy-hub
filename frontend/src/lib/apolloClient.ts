import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { env } from './env';

const httpLink = createHttpLink({
  uri: env.API_URL || 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: env.WS_URL || 'ws://localhost:4000/graphql',
  connectionParams: () => {
    const token = localStorage.getItem('codemande_token');
    return {
      authorization: token ? `Bearer ${token}` : "",
    };
  },
}));

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('codemande_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
        },
      },
    }
  }),
});

export default client;
