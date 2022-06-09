import { AppContext } from "@/checkout-app/frontend/components/elements/AppProvider";
import { useContext } from "react";

export const useApp = () => {
  const app = useContext(AppContext);

  return app;
};
