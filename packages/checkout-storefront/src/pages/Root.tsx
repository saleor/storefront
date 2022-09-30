import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";
import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { ClientOptions, createClient, Provider as UrqlProvider } from "urql";

import { DEFAULT_LOCALE, getCurrentLocale } from "@/checkout-storefront/lib/regions";
import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { Checkout, CheckoutSkeleton } from "@/checkout-storefront/views/Checkout";
import {
  OrderConfirmation,
  OrderConfirmationSkeleton,
} from "@/checkout-storefront/views/OrderConfirmation";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { Suspense, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { useFormattedMessages } from "../hooks";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { DummyPayment } from "../views/DummyPayment";
export interface RootProps {
  env: AppEnv;
}

const Views = () => {
  const orderId = getQueryVariables().orderId;
  const dummyPayment = getQueryVariables().dummyPayment;
  const formatMessage = useFormattedMessages();

  if (orderId) {
    if (dummyPayment) {
      return (
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              <span className="text-text-secondary">{formatMessage("loadingWithDots")}</span>
            </div>
          }
        >
          <DummyPayment />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmation orderId={orderId} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout />
    </Suspense>
  );
};

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
    []
  );

  // temporarily need to use @apollo/client because saleor sdk
  // is based on apollo. to be changed
  const saleorClient = useMemo(
    () =>
      createSaleorClient({
        apiUrl: env.apiUrl,
        channel: "default-channel",
      }),
    []
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
                <Views />
              </ErrorBoundary>
            </div>
          </AppConfigProvider>
        </UrqlProvider>
      </IntlProvider>
    </SaleorProvider>
  );
};
