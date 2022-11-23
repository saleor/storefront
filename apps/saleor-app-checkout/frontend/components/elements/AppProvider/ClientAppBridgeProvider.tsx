import { createGraphqlClient } from "@/saleor-app-checkout/frontend/misc/client";
import createSafeContext from "@/saleor-app-checkout/frontend/misc/createSafeContext";
import { AppBridge } from "@saleor/app-sdk/app-bridge";
import { Provider as UrqlProvider } from "urql";
import { ReactNode, useMemo } from "react";
import { useSynchronizedAppBridgePaths } from "./useSynchronizedAppBridgePaths";
import { useSubscribeToIsAuthorized } from "./useSubscribeToIsAuthorized";

interface IAppContext {
  app: AppBridge;
  isAuthorized: boolean;
}

const [useAppContext, AppContextProvider] = createSafeContext<IAppContext>();
export { useAppContext };

export const ClientAppBridgeProvider = ({ children }: { children: ReactNode }) => {
  const app = useMemo(() => new AppBridge(), []);
  const isAuthorized = useSubscribeToIsAuthorized(app);
  useSynchronizedAppBridgePaths(app);

  // @todo use `saleorApiUrl`
  const domain = app.getState().domain;
  const saleorApiUrl = `https://${domain}/graphql/`;
  const client = useMemo(
    () => createGraphqlClient(saleorApiUrl, app.getState().token),
    [app, saleorApiUrl]
  );

  const appContext = useMemo(() => ({ app, isAuthorized }), [app, isAuthorized]);

  return (
    <UrqlProvider value={client}>
      <AppContextProvider value={appContext}>{children}</AppContextProvider>
    </UrqlProvider>
  );
};
