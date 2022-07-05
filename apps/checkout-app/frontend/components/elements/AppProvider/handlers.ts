import { app } from "@/checkout-app/frontend/misc/app";
import { getRawAppPath } from "@/checkout-app/frontend/utils";
import { actions } from "@saleor/app-bridge";
import { NextRouter } from "next/router";

export const handleRedirectEvent = (router: NextRouter, path: string) => {
  if (path && path !== router.pathname) {
    void router.push(path);
  }
};

export const handleRouteChange = (path: string) => {
  const rawPath = getRawAppPath(path);
  void app?.dispatch(
    actions.Redirect({
      to: `/apps/${encodeURIComponent(app.getState().id)}/app${rawPath}`,
    })
  );
};
