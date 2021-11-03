import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";

import ChannelsProvider from "@/components/ChannelsProvider";
import SaleorProviderWithChannels from "@/components/SaleorProviderWithChannels";
import apolloClient from "@/lib/graphql";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ChannelsProvider>
      <ApolloProvider client={apolloClient}>
        <SaleorProviderWithChannels>
          {getLayout(<Component {...pageProps} />)}
        </SaleorProviderWithChannels>
      </ApolloProvider>
    </ChannelsProvider>
  );
};

export default MyApp;
