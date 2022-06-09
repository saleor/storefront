import "@/checkout/index.css";

import { createClient, Provider as UrqlProvider, ClientOptions } from "urql";
import { ErrorBoundary } from "react-error-boundary";
import { I18nProvider } from "@react-aria/i18n";
import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";

import { Checkout } from "@/checkout/Checkout";
import { getCurrentRegion } from "@/checkout/lib/regions";
import { envVars, getQueryVariables } from "@/checkout/lib/utils";
import { AppConfigProvider } from "@/checkout/providers/AppConfigProvider";
import { ErrorsProvider } from "@/checkout/providers/ErrorsProvider";
import { OrderConfirmation } from "@/checkout/sections/OrderConfirmation";
import { PageNotFound } from "@/checkout/sections/PageNotFound";

const authorizedFetch = createFetch();

const client = createClient({
  url: envVars.apiUrl,
  suspense: true,
  requestPolicy: "network-only",
  fetch: authorizedFetch as ClientOptions["fetch"],
});

// temporarily need to use @apollo/client because saleor sdk
// is based on apollo. to be changed
const saleorClient = createSaleorClient({
  apiUrl: envVars.apiUrl,
  channel: "default-channel",
});

export const Root = () => {
  const orderId = getQueryVariables().orderId;

  return (
    // @ts-ignore React 17 <-> 18 type mismatch
    <SaleorProvider client={saleorClient}>
      <I18nProvider locale={getCurrentRegion()}>
        <UrqlProvider value={client}>
          <AppConfigProvider>
            <ErrorsProvider>
              <div className="app">
                {/* @ts-ignore React 17 <-> 18 type mismatch */}
                <ErrorBoundary FallbackComponent={PageNotFound}>
                  {orderId ? (
                    <OrderConfirmation orderId={orderId} />
                  ) : (
                    <Checkout />
                  )}
                </ErrorBoundary>
              </div>
            </ErrorsProvider>
          </AppConfigProvider>
        </UrqlProvider>
      </I18nProvider>
    </SaleorProvider>
  );
};
