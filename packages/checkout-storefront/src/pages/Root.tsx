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
import { useMemo, useState, useCallback } from "react";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { DEFAULT_LOCALE, getCurrentLocale, Locale } from "@/checkout-storefront/lib/regions";

import En from "../../content/compiled-locales/en-US.json";
import Minion from "../../content/compiled-locales/minion.json";

export interface RootProps {
  env: AppEnv;
}

const localeToMessages = {
  "en-US": En,
  minion: Minion,
};

const useCurrentLocale = () => {
  const [currentLocale, setCurrentLocale] = useState<Locale>(getCurrentLocale());

  const messages =
    currentLocale in localeToMessages
      ? localeToMessages[currentLocale as keyof typeof localeToMessages]
      : null;

  if (!messages) {
    console.warn(`Missing messages for locale: ${currentLocale}`);
  }

  return { currentLocale, setCurrentLocale, messages: messages || {} };
};

export const Root = ({ env }: RootProps) => {
  const { currentLocale, setCurrentLocale, messages } = useCurrentLocale();

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

  const handleUrlChange = useCallback(
    ({ queryParams: { locale } }: UrlChangeHandlerArgs) => {
      setCurrentLocale(locale);
    },
    [setCurrentLocale]
  );

  useUrlChange(handleUrlChange);

  return (
    // @ts-ignore React 17 <-> 18 type mismatch
    <SaleorProvider client={saleorClient}>
      <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={currentLocale} messages={messages}>
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
