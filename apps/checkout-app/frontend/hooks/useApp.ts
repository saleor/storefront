import { AppContext } from "@/frontend/components/elements/AppProvider";
import { useContext } from "react";

export const useApp = () => {
  const app = useContext(AppContext);

  return app;
};
