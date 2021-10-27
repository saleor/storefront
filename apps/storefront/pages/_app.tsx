import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { SaleorProvider } from "@saleor/sdk";

import apolloClient, { saleorClient } from "@/lib/graphql";

import "styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <SaleorProvider client={saleorClient}>
        <Component {...pageProps} />
      </SaleorProvider>
    </ApolloProvider>
  );
}

export default MyApp;
