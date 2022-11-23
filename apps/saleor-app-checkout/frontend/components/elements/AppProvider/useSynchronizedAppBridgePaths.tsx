import { getRawAppPath } from "@/saleor-app-checkout/frontend/utils";
import { actions, AppBridge, EventType } from "@saleor/app-sdk/app-bridge";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useSynchronizedAppBridgePaths = (app: AppBridge) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (path: string) => {
      const rawPath = getRawAppPath(path);
      void app.dispatch(
        actions.Redirect({
          to: `/apps/${encodeURIComponent(app.getState().id)}/app${rawPath}`,
        })
      );
    };

    const unsubscribe = app.subscribe(EventType.redirect, ({ path }) => {
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
};
