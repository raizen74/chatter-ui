import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { API_URL, WS_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import { onLogout } from "../utils/logout";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const logoutLink = onError((error) => {
  // we have access to all GraphQL errors
  if (
    error.graphQLErrors?.length &&
    error.graphQLErrors[0]?.extensions?.originalError &&
    (error.graphQLErrors[0].extensions.originalError as any)?.statusCode === 401
  ) {
    if (!excludedRoutes.includes(window.location.pathname)) {
      onLogout();
    }
  }
});

const httpLink = new HttpLink({ uri: `${API_URL}/graphql` });

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${WS_URL}/graphql`,
  })
);

// Link to direct operations to different links
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(
    {
    typePolicies: {
      Query: {
        fields: {
          chats: {
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              const merged = existing ? existing.slice(0) : [];
              for (let i = 0; i < incoming.length; ++i) {
                merged[args!.skip + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }
),
  link: logoutLink.concat(splitLink), // combine the error link with the splitLink
});

const merge = () => {
  
}

export default client;
