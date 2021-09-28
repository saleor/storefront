import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import "styles/globals.css";

import apolloClient, { saleorClient } from "@/lib/graphql";

import { SaleorProvider } from "@saleor/sdk";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <SaleorProvider client={saleorClient}>
        <Component {...pageProps} />
      </SaleorProvider>
    </ApolloProvider>
  );
}

export default MyApp;
