import { createGraphqlClient } from "@/saleor-app-checkout/frontend/misc/client";
import createSafeContext from "@/saleor-app-checkout/frontend/misc/createSafeContext";
import { actions, AppBridge } from "@saleor/app-sdk/app-bridge";
import { useRouter } from "next/router";
import { Provider as UrqlProvider } from "urql";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { getRawAppPath } from "@/saleor-app-checkout/frontend/utils";

interface IAppContext {
  app: AppBridge;
  isAuthorized: boolean;
}

const [useAppContext, AppContextProvider] = createSafeContext<IAppContext>();
export { useAppContext };

export const ClientAppBridgeProvider = ({ children }: { children: ReactNode }) => {
  const app = useMemo(() => new AppBridge(), []);

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(!!app.getState()?.token);

  // @todo use `getState().saleorApiUrl`
  const domain = app.getState().domain;
  const saleorApiUrl = `https://${domain}/graphql/`;
  const client = useMemo(
    () => createGraphqlClient(saleorApiUrl, app.getState().token),
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
  }, [app]);

  useEffect(() => {
    const handleRouteChange = (path: string) => {
      const rawPath = getRawAppPath(path);
      void app.dispatch(
        actions.Redirect({
          to: `/apps/${encodeURIComponent(app.getState().id)}/app${rawPath}`,
        })
      );
    };

    const unsubscribe = app.subscribe("redirect", ({ path }) => {
      if (path && path !== router.pathname) {
        void router.push(path);
      }
    });
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      unsubscribe();
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [app, router]);

  const appContext = useMemo(() => ({ app, isAuthorized }), [app, isAuthorized]);

  return (
    <UrqlProvider value={client}>
      <AppContextProvider value={appContext}>{children}</AppContextProvider>
    </UrqlProvider>
  );
};
