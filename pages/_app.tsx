import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { ReactElement, ReactNode } from "react";

import RegionsProvider from "@/components/RegionsProvider";
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
    <>
      <Head>
        {/*
          Adding preconnect/dns-prefetch allow us to not wait for dns resolving
          when contacting the Saleor API for the first time.
          https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
        */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_URI}
          crossOrigin="true"
        />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URI} />
      </Head>
      <RegionsProvider>
        <ApolloProvider client={apolloClient}>
          <SaleorProviderWithChannels>
            {getLayout(<Component {...pageProps} />)}
          </SaleorProviderWithChannels>
        </ApolloProvider>
      </RegionsProvider>
    </>
  );
};

export default MyApp;
