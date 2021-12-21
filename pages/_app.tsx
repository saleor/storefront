import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import React from "react";

import ChannelsProvider from "@/components/ChannelsProvider";
import SaleorProviderWithChannels from "@/components/SaleorProviderWithChannels";
import apolloClient from "@/lib/graphql";
import { Layout } from "@/components";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChannelsProvider>
      <ApolloProvider client={apolloClient}>
        <SaleorProviderWithChannels>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SaleorProviderWithChannels>
      </ApolloProvider>
    </ChannelsProvider>
  );
};

export default MyApp;
