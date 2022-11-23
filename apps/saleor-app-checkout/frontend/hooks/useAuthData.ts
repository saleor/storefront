import { useAppContext } from "../components/elements/AppProvider/ClientAppBridgeProvider";

export const useAuthData = () => {
  const { app, isAuthorized } = useAppContext();

  return {
    appId: app.getState().id,
    isAuthorized,
  };
};
