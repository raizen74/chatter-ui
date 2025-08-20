import { useEffect, useState } from "react";
import router from "../components/Route";

export const usePath = () => {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    // Subscribe to route changes and update the path state
    router.subscribe((state) => setPath(state.location.pathname));
  }); // No deps -> executes only once on mount

  return path;
};
