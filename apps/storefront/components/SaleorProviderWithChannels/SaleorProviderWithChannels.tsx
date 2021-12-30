import { SaleorProvider } from "@saleor/sdk";
import React, { PropsWithChildren, useEffect } from "react";

import { saleorClient } from "@/lib/graphql";

import { useChannels } from "../ChannelsProvider";

const SaleorProviderWithChannels = ({ children }: PropsWithChildren<{}>) => {
  const { currentChannel } = useChannels();

  const {
    config: { setChannel },
  } = saleorClient;

  useEffect(() => {
    setChannel(currentChannel.slug);
  }, [currentChannel, setChannel]);

  return <SaleorProvider client={saleorClient}>{children}</SaleorProvider>;
};

export default SaleorProviderWithChannels;
