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
import { useLocale } from "../hooks/useLocale";
import { DEFAULT_LOCALE } from "../lib/regions";
import { getQueryParams } from "../lib/utils/url";

export interface RootProps {
  env: AppEnv;
}
export const Root = ({ env }: RootProps) => {
  const authorizedFetch = useMemo(() => createFetch(), []);
  const { saleorApiUrl } = getQueryParams();
  const { locale, messages, channel } = useLocale();

  const client = useMemo(
    () =>
      saleorApiUrl
        ? createClient({
            url: saleorApiUrl,
            suspense: true,
            requestPolicy: "cache-first",
            fetch: authorizedFetch as ClientOptions["fetch"],
          })
        : null,
    [authorizedFetch, saleorApiUrl]
  );

  // temporarily need to use @apollo/client because saleor sdk
  // is based on apollo. to be changed
  const saleorClient = useMemo(
    () =>
      saleorApiUrl
        ? createSaleorClient({
            apiUrl: saleorApiUrl,
            channel,
          })
        : null,
    [saleorApiUrl]
  );

  if (!saleorApiUrl) {
    console.warn(`Missing "saleorApiUrl" query param!`);
    return null;
  }
  if (!saleorClient) {
    console.warn(`Couldn't create saleor client!`);
    return null;
  }
  if (!client) {
    console.warn(`Couldn't create URQL client!`);
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
