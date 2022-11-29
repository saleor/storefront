import { createGraphqlClient } from "@/saleor-app-checkout/frontend/misc/client";
import createSafeContext from "@/saleor-app-checkout/frontend/misc/createSafeContext";
import { AppBridge } from "@saleor/app-sdk/app-bridge";
import { Provider as UrqlProvider } from "urql";
import { ReactNode, useMemo } from "react";
import { useSynchronizedAppBridgePaths } from "./useSynchronizedAppBridgePaths";
import { useSubscribeToIsAuthorized } from "./useSubscribeToIsAuthorized";
import invariant from "ts-invariant";

interface IAppContext {
  app: AppBridge;
  isAuthorized: boolean;
}

// appBridge instance needs to be created before the first render
// otherwise, we never get the "handshake" event or the token
const appBridge = typeof document === "undefined" ? null : new AppBridge();

const [useAppContext, AppContextProvider] = createSafeContext<IAppContext>();
export { useAppContext };

export const ClientAppBridgeProvider = ({ children }: { children: ReactNode }) => {
  const app = appBridge;
  invariant(app, "ClientAppBridgeProvider is not available on the server side");

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
