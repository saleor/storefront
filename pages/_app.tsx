import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";

import RegionsProvider from "@/components/RegionsProvider";
import SaleorProviderWithChannels from "@/components/SaleorProviderWithChannels";
import apolloClient from "@/lib/graphql";
import { CheckoutWithTokenProvider } from "@/lib/providers/CheckoutWithTokenProvider";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ApolloProvider client={apolloClient}>
      <CheckoutWithTokenProvider>
        <RegionsProvider>
          <SaleorProviderWithChannels>
            {getLayout(<Component {...pageProps} />)}
          </SaleorProviderWithChannels>
        </RegionsProvider>
      </CheckoutWithTokenProvider>
    </ApolloProvider>
  );
};

export default MyApp;
