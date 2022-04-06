import { createApp } from "@saleor/app-bridge";
import { createContext, useMemo } from "react";

interface IAppContext {
  app?: any;
}

export const AppContext = createContext<IAppContext>({ app: undefined });

const AppProvider: React.FC = (props) => {
  const app = useMemo(() => {
    if (typeof window !== "undefined") {
      return createApp();
    }
  }, []);

  return <AppContext.Provider value={{ app }} {...props} />;
};
export default AppProvider;
