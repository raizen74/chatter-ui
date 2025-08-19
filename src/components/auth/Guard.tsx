import { JSX } from "react";
import { useGetMe } from "../../hooks/useGetMe";
import excludedRoutes from "../../constants/excluded-routes";

interface GuardProps {
  children: JSX.Element;
}

const Guard = ({ children }: GuardProps) => {
  // receives <RouterProvider router={router} /> as children
  const { data: user } = useGetMe(); // fetches the current user
  // console.log(user);
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
