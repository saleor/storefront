import { AppBridge, EventType } from "@saleor/app-sdk/app-bridge";
import { useState, useEffect } from "react";

export const useSubscribeToIsAuthorized = (app: AppBridge) => {
  const [isAuthorized, setIsAuthorized] = useState(!!app.getState().token);
  useEffect(() => {
    if (app) {
      setIsAuthorized(!!app.getState().token);

      const unsubscribe = app.subscribe(EventType.handshake, (payload) => {
        setIsAuthorized(!!payload.token);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [app]);

  return isAuthorized;
};
