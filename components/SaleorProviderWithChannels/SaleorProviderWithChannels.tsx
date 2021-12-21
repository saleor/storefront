import { SaleorProvider } from "@saleor/sdk";
import React, { useEffect } from "react";

import { saleorClient } from "@/lib/graphql";

import useChannels from "../ChannelsProvider/useChannels";
import { WithChildren } from "@/lib/globalTypes";

const SaleorProviderWithChannels = ({ children }: WithChildren) => {
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
