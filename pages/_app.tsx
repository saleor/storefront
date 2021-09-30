import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import "styles/globals.css";

import apolloClient, { saleorClient } from "@/lib/graphql";

import { SaleorProvider } from "@saleor/sdk";
import React, { useState } from "react";
import { DEFAULT_CHANNEL } from "@/lib/const";

type ChannelContextProps = {
  channel: string;
  setChannel: (channel: string) => void;
};

export const ChannelContext = React.createContext<ChannelContextProps>({
  channel: DEFAULT_CHANNEL,
  setChannel: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [channel, setChannel] = useState(DEFAULT_CHANNEL);

  const onChannelChange = async (channel: string) => {
    setChannel(channel);
    await apolloClient.resetStore();
  };

  return (
    <ApolloProvider client={apolloClient}>
      <SaleorProvider client={saleorClient}>
        <ChannelContext.Provider
          value={{ channel, setChannel: onChannelChange }}
        >
          <Component {...pageProps} />
        </ChannelContext.Provider>
      </SaleorProvider>
    </ApolloProvider>
  );
}

export default MyApp;
