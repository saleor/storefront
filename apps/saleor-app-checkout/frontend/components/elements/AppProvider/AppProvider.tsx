import { app } from "@/saleor-app-checkout/frontend/misc/app";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { handleRedirectEvent, handleRouteChange } from "./handlers";
import { AppBridge } from "@saleor/app-sdk/app-bridge";
import { Provider as ClientProvider } from "urql";
import { createGraphqlClient } from "@/saleor-app-checkout/frontend/misc/client";

interface IAppContext {
  app?: AppBridge;
  isAuthorized: boolean;
}

export const AppContext = createContext<IAppContext>({
  app: undefined,
  isAuthorized: false,
});

const AppProvider: React.FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(!!app?.getState()?.token);

  const domain = app?.getState().domain;
  const saleorApiUrl = domain ? `https://${domain}/graphql/` : "";

  const client = useMemo(
    () => (saleorApiUrl ? createGraphqlClient(saleorApiUrl) : null),
    [saleorApiUrl]
  );

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
  }, [router]);

  if (!client) {
    return null;
  }

  return (
    <ClientProvider value={client}>
      <AppContext.Provider value={{ app, isAuthorized }} {...props} />
    </ClientProvider>
  );
};
export default AppProvider;
