import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRouteChanged = (fn: () => void) => {
  const location = useLocation();
  useEffect(() => {
    fn();
  }, [location, fn]);
};

export default useRouteChanged;
