import { JSX, useEffect } from "react";
import { useGetMe } from "../../hooks/useGetMe";
import excludedRoutes from "../../constants/excluded-routes";
import { authenticatedVar } from "../../constants/authenticated";
import { snackVar } from "../../constants/snack";
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../../constants/error";

interface GuardProps {
  children: JSX.Element;
}

// receives <RouterProvider router={router} /> as children
const Guard = ({ children }: GuardProps) => {
  // useGetMe call will fail when user is unathorized
  const { data: user, error } = useGetMe(); // fetches the current user

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  useEffect(() => {
    if (error?.networkError) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
    }
  }, [error]);

  console.log("Logged user: ", user);
  // check if the current route is excluded with JS window object
  // and only render children (<RouterProvider router={router} />) if user is authenticated or route is not excluded
  return (
    <>
      {excludedRoutes.includes(window.location.pathname)
        ? children
        : user && children}
    </>
  );
};

export default Guard;
