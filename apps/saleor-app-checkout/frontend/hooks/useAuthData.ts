import { isSsr } from "@/saleor-app-checkout/constants";
import { useMemo } from "react";
import { useApp } from "./useApp";

export interface AuthTokenPayload {
  appId: string;
  isAuthorized: boolean;
}

export const useAuthData = (): AuthTokenPayload => {
  const { app, isAuthorized } = useApp();

  const appId = useMemo(() => {
    return app?.getState()?.id;
  }, [app]);

  return {
    get appId(): string {
      if (isSsr) {
        console.warn(`** USAGE OF appId in SSR detected **
If you want to use appId in SSR you need to:
  a) fetch it from Saleor by using App query in ./graphql/app.grpahql
  b) use queries that don't require passing id of the app by using authToken to authenticate the request (for an example see the PublicMetafieldsInfered query)`);
        return "";
      }
      if (!appId) {
        console.warn("appId is undefined - check if app-bridge was initialized correctly");
      }
      return appId || "";
    },
    isAuthorized: isAuthorized,
  };
};
