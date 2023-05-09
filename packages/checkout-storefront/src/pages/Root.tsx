import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { Provider as UrqlProvider } from "urql";

import { AppConfigProvider } from "@/checkout-storefront/providers/AppConfigProvider";
import { AppEnv } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { PageNotFound } from "@/checkout-storefront/views/PageNotFound";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "../hooks/useAlerts/consts";
import { RootViews } from "../views/RootViews";
import { useLocale } from "../hooks/useLocale";
import { DEFAULT_LOCALE } from "../lib/regions";
import { getQueryParams } from "../lib/utils/url";
import { useUrqlClient } from "@/checkout-storefront/lib/auth/useUrqlClient";
import { SaleorAuthProvider } from "@/checkout-storefront/lib/auth/SaleorAuthProvider";
import { useSaleorAuthClient } from "@/checkout-storefront/lib/auth/useSaleorAuthClient";
import { useAuthChange } from "@/checkout-storefront/lib/auth";
import invariant from "ts-invariant";

export interface RootProps {
  env: AppEnv;
  saleorApiUrlRegex: RegExp;
}

export const Root = ({ env, saleorApiUrlRegex }: RootProps) => {
  const { saleorApiUrl } = getQueryParams();

  invariant(
    saleorApiUrlRegex.test(saleorApiUrl),
    `
Provided saleorApiUrl doesn't match allowed regex!
Provided: ${saleorApiUrl}
Allowed: ${String(saleorApiUrlRegex)}
    `.trim()
  );

  const { locale, messages } = useLocale();
  const useSaleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl,
    storage: localStorage,
  });

  const { saleorAuthClient } = useSaleorAuthClientProps;

  const { urqlClient, resetClient } = useUrqlClient({
    suspense: true,
    requestPolicy: "cache-first",
    url: saleorApiUrl,
    fetch: saleorAuthClient.fetchWithAuth,
  });

  useAuthChange({
    onSignedOut: () => {
      resetClient();
    },
    onSignedIn: () => {
      resetClient();
    },
  });

  if (!saleorApiUrl) {
    console.warn(`Missing "saleorApiUrl" query param!`);
    return null;
  }

  if (!urqlClient) {
    console.warn(`Couldn't create URQL client!`);
    return null;
  }

  return (
    <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={locale} messages={messages}>
      <SaleorAuthProvider {...useSaleorAuthClientProps}>
        <UrqlProvider value={urqlClient}>
          <AppConfigProvider env={env}>
            <div className="app">
              <ToastContainer {...alertsContainerProps} />
              <ErrorBoundary FallbackComponent={PageNotFound}>
                <RootViews />
              </ErrorBoundary>
            </div>
          </AppConfigProvider>
        </UrqlProvider>
      </SaleorAuthProvider>
    </IntlProvider>
  );
};
