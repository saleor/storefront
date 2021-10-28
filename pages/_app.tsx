import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { SaleorProvider } from "@saleor/sdk";
import type { AppProps } from "next/app";

import apolloClient, { saleorClient } from "@/lib/graphql";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <SaleorProvider client={saleorClient}>
        <Component {...pageProps} />
      </SaleorProvider>
    </ApolloProvider>
  );
};

export default MyApp;
