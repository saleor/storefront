import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";

import RegionsProvider from "@/components/RegionsProvider";
import SaleorProviderWithChannels from "@/components/SaleorProviderWithChannels";
import apolloClient from "@/lib/graphql";
import { CheckoutProvider } from "@/lib/providers/CheckoutProvider";

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
      <CheckoutProvider>
        <RegionsProvider>
          <SaleorProviderWithChannels>
            {getLayout(<Component {...pageProps} />)}
          </SaleorProviderWithChannels>
        </RegionsProvider>
      </CheckoutProvider>
    </ApolloProvider>
  );
};

export default MyApp;
