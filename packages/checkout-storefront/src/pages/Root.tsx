import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";
import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { ClientOptions, createClient, Provider as UrqlProvider } from "urql";

import { DEFAULT_LOCALE, getCurrentLocale } from "@/checkout-storefront/lib/regions";
import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { RootViews } from "../views/RootViews/RootViews";
export interface RootProps {
  env: AppEnv;
}

export const Root = ({ env }: RootProps) => {
  const authorizedFetch = useMemo(() => createFetch(), []);

  const client = useMemo(
    () =>
      createClient({
        url: env.apiUrl,
        suspense: true,
        requestPolicy: "cache-and-network",
        fetch: authorizedFetch as ClientOptions["fetch"],
      }),
    [authorizedFetch, env.apiUrl]
  );

  // temporarily need to use @apollo/client because saleor sdk
  // is based on apollo. to be changed
  const saleorClient = useMemo(
    () =>
      createSaleorClient({
        apiUrl: env.apiUrl,
        channel: "default-channel",
      }),
    [env.apiUrl]
  );

  return (
    // @ts-ignore React 17 <-> 18 type mismatch
    <SaleorProvider client={saleorClient}>
      <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={getCurrentLocale()}>
        <UrqlProvider value={client}>
          <AppConfigProvider env={env}>
            <div className="app">
              <ToastContainer {...alertsContainerProps} />
              <ErrorBoundary FallbackComponent={PageNotFound}>
                <RootViews />
              </ErrorBoundary>
            </div>
          </AppConfigProvider>
        </UrqlProvider>
      </IntlProvider>
    </SaleorProvider>
  );
};
