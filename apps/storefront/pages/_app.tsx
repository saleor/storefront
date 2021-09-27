import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import "styles/globals.css";

import apolloClient from "@/lib/graphql";

import { SaleorProvider, createSaleorClient } from "@saleor/sdk";

const saleorClient = createSaleorClient({
  apiUrl: "https://vercel.saleor.cloud/graphql/",
  channel: "default-channel",
});

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
