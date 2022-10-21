import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@saleor/macaw-ui";
import { IntlProvider } from "react-intl";
import { Provider as ClientProvider } from "urql";
import { useFormattedMessages } from "@/saleor-app-checkout/frontend/hooks/useFormattedMessages";
import AppContainer from "@/saleor-app-checkout/frontend/components/elements/AppContainer";
import AppProvider from "@/saleor-app-checkout/frontend/components/elements/AppProvider";
import { client } from "@/saleor-app-checkout/frontend/misc/client";
import PrivateSettingsProvider from "@/saleor-app-checkout/frontend/components/elements/PrivateSettingsProvider";
import "@saleor/checkout-storefront/dist/esm/index.css";
import { useEffect } from "react";

declare global {
  // eslint-disable-next-line no-var -- var is required here
  var __SALEOR_CHECKOUT_ENV__: string;
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const { locale, messages } = useFormattedMessages();

  const version = [
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "",
    process.env.NEXT_PUBLIC_SENTRY_RELEASE || "",
  ].join("-");

  useEffect(() => {
    globalThis.__SALEOR_CHECKOUT_ENV__ = version;
  }, [version]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <style>
          {`
            html,
            body {
              height: 100%;
              width: 100%;
            }
            *,
            *:after,
            *:before {
              box-sizing: border-box;
            }
            body {
              font-size: 1rem;
              margin: 0;
              background: transparent !important;
            }
          `}
        </style>
      </Head>
      <AppProvider>
        <ClientProvider value={client}>
          <PrivateSettingsProvider>
            <IntlProvider
              locale={locale}
              messages={messages}
              onError={() => null} // Hide missing translation warnings
            >
              {/* @ts-expect-error React 17 <-> 18 types mismatch */}
              <ThemeProvider ssr={true}>
                <AppContainer>
                  <Component {...pageProps} />
                </AppContainer>
                <footer
                  style={{
                    fontSize: "0.8em",
                    textAlign: "center",
                    color: "#777",
                    transform: "translateY(-100%)",
                    height: "1.7rem",
                    marginTop: "-1.7rem",
                  }}
                >
                  <small>{version}</small>
                </footer>
              </ThemeProvider>
            </IntlProvider>
          </PrivateSettingsProvider>
        </ClientProvider>
      </AppProvider>
    </>
  );
}
