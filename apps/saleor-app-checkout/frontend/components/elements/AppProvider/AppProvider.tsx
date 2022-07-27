import { app, AppBridge } from "@/saleor-app-checkout/frontend/misc/app";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { handleRedirectEvent, handleRouteChange } from "./handlers";

interface IAppContext {
  app?: AppBridge;
  isAuthorized: boolean;
}

export const AppContext = createContext<IAppContext>({
  app: undefined,
  isAuthorized: false,
});

const AppProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(!!app?.getState()?.token);

  useEffect(() => {
    if (app) {
      setIsAuthorized(!!app.getState().token);

      const unsubscribe = app.subscribe("handshake", (payload) => {
        setIsAuthorized(!!payload.token);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (app) {
      const unsubscribe = app?.subscribe("redirect", ({ path }) => {
        handleRedirectEvent(router, path);
      });
      router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        unsubscribe();
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  return <AppContext.Provider value={{ app, isAuthorized }} {...props} />;
};
export default AppProvider;
