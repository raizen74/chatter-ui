import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { API_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import { onLogout } from "../utils/logout";

const logoutLink = onError((error) => {
  // we have access to all GraphQL errors
  console.log('onError')
  console.log(error)
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
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: logoutLink.concat(httpLink), // combine the error link with the HTTP link
});

export default client;
