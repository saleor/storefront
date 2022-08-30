import { SaleorProvider } from "@saleor/sdk";
import React, { ReactNode, useEffect } from "react";

import { saleorClient } from "@/lib/graphql";

import { useRegions } from "../RegionsProvider";

export function SaleorProviderWithChannels({ children }: { children: ReactNode }) {
  const { currentChannel } = useRegions();

  const {
    config: { setChannel },
  } = saleorClient;

  useEffect(() => {
    setChannel(currentChannel.slug);
  }, [currentChannel, setChannel]);

  // @ts-expect-error React 17 <-> 18 types mismatch
  return <SaleorProvider client={saleorClient}>{children}</SaleorProvider>;
}

export default SaleorProviderWithChannels;
