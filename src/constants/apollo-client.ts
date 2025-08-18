import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { API_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import router from "../components/Route";

const logoutLink = onError((error) => {
  // we have access to all GraphQL errors
  if (
    error.graphQLErrors?.length &&
    error.graphQLErrors[0]?.extensions?.originalError &&
    (error.graphQLErrors[0].extensions.originalError as any)?.statusCode === 401
    
    
  ) {
    console.log(error.graphQLErrors[0].extensions.originalError)
    if (!excludedRoutes.includes(window.location.pathname)) {
      router.navigate("/login"); // redirect to login if the user is not authenticated
      client.resetStore(); // reset the Apollo Client cached data
    }
  }
});

const httpLink = new HttpLink({ uri: `${API_URL}/graphql` });
console.log(httpLink);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: logoutLink.concat(httpLink), // combine the error link with the HTTP link
});

export default client;
