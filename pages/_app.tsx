import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { SaleorProvider } from "@saleor/sdk";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

import apolloClient, { saleorClient } from "@/lib/graphql";

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
      <SaleorProvider client={saleorClient}>
        {getLayout(<Component {...pageProps} />)}
      </SaleorProvider>
    </ApolloProvider>
  );
};

export default MyApp;
