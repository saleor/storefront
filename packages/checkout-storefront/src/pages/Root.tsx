import { createClient, Provider as UrqlProvider, ClientOptions } from "urql";
import { ErrorBoundary } from "react-error-boundary";
import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";
import { IntlProvider } from "react-intl";

import { Checkout, CheckoutSkeleton } from "@/checkout-storefront/views/Checkout";
import { DEFAULT_LOCALE, getCurrentLocale } from "@/checkout-storefront/lib/regions";
import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import {
  OrderConfirmation,
  OrderConfirmationSkeleton,
} from "@/checkout-storefront/views/OrderConfirmation";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { Suspense, useMemo } from "react";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";

export interface RootProps {
  env: AppEnv;
}

export const Root = ({ env }: RootProps) => {
  const orderId = getQueryVariables().orderId;

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
                {orderId ? (
                  <Suspense fallback={<OrderConfirmationSkeleton />}>
                    <OrderConfirmation orderId={orderId} />
                  </Suspense>
                ) : (
                  <Suspense fallback={<CheckoutSkeleton />}>
                    <Checkout />
                  </Suspense>
                )}
              </ErrorBoundary>
            </div>
          </AppConfigProvider>
        </UrqlProvider>
      </IntlProvider>
    </SaleorProvider>
  );
};
