import router from "../components/Route";
import client from "../constants/apollo-client";
import { authenticatedVar } from "../constants/authenticated";

export const onLogout = () => {
  authenticatedVar(false); // no longer authenticated

  router.navigate("/login"); // redirect to login if the user is not authenticated
  client.resetStore(); // reset the Apollo Client cached data
};
