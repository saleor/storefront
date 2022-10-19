import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";
import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { ClientOptions, createClient, Provider as UrqlProvider } from "urql";

import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { RootViews } from "../views/RootViews/RootViews";
import { useMemo } from "react";
import { DEFAULT_LOCALE } from "@/checkout-storefront/lib/regions";
import { getQueryParams } from "../lib/utils/url";
import { useLocale } from "../hooks/useLocale";

export interface RootProps {
  env: AppEnv;
}
export const Root = ({ env }: RootProps) => {
  const authorizedFetch = useMemo(() => createFetch(), []);
  const { locale, messages, channel } = useLocale();
  const { saleorApiHost } = getQueryParams();

  const client = useMemo(
    () =>
      saleorApiHost
        ? createClient({
            url: `https://${saleorApiHost}/graphql/`,
            suspense: true,
            requestPolicy: "cache-and-network",
            fetch: authorizedFetch as ClientOptions["fetch"],
          })
        : null,
    [authorizedFetch, saleorApiHost]
  );

  // temporarily need to use @apollo/client because saleor sdk
  // is based on apollo. to be changed
  const saleorClient = useMemo(
    () =>
      saleorApiHost
        ? createSaleorClient({
            apiUrl: `https://${saleorApiHost}/graphql/`,
            channel: channel,
          })
        : null,
    [saleorApiHost, channel]
  );

  if (!saleorApiHost || !saleorClient || !client) {
    console.warn(`Missing "domain" query param!`);
    return null;
  }

  return (
    // @ts-ignore React 17 <-> 18 type mismatch
    <SaleorProvider client={saleorClient}>
      <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={locale} messages={messages}>
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
