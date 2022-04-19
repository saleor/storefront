import { parseJwt } from "@/frontend/utils";
import { useApp } from "./useApp";

export interface AuthTokenPayload {
  app: string;
}

export const useAuthData = (): AuthTokenPayload => {
  const app = useApp();
  const appState = app?.getState();
  const payload = appState?.token ? parseJwt(appState.token) : { app: "" };

  return payload;
};
