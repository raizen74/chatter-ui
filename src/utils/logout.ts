import router from "../components/Route";
import client from "../constants/apollo-client";

export const onLogout = () => {
  router.navigate("/login"); // redirect to login if the user is not authenticated
  client.resetStore(); // reset the Apollo Client cached data
};
