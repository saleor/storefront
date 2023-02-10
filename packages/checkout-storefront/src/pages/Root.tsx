import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { Provider as UrqlProvider } from "urql";

import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { RootViews } from "../views/RootViews/RootViews";
import { useLocale } from "../hooks/useLocale";
import { DEFAULT_LOCALE } from "../lib/regions";
import { getQueryParams } from "../lib/utils/url";
import { useUrqlClient } from "@/checkout-storefront/lib/auth/useUrqlClient";
import { useAuthChange } from "@/checkout-storefront/lib/auth/useAuthChange";

export interface RootProps {
  env: AppEnv;
}

export const Root = ({ env }: RootProps) => {
  const { saleorApiUrl } = getQueryParams();
  const { locale, messages } = useLocale();
  const { client, resetClient } = useUrqlClient({ url: saleorApiUrl || "" });
  useAuthChange({ onAuthSuccess: resetClient, onAuthError: resetClient });

  if (!saleorApiUrl) {
    console.warn(`Missing "saleorApiUrl" query param!`);
    return null;
  }

  if (!client) {
    console.warn(`Couldn't create URQL client!`);
    return null;
  }

  return (
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
  );
};
