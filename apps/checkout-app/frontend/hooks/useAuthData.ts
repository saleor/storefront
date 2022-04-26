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
    appId: appId || "",
    isAuthorized: isAuthorized,
  };
};
