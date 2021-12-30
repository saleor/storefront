import { useRouter } from "next/router";
import React, { PropsWithChildren, useState } from "react";

import apolloClient from "@/lib/graphql";
import { Channel, CHANNELS, DEFAULT_CHANNEL } from "@/lib/regions";
import createSafeContext from "@/lib/useSafeContext";

export interface ChannelsConsumerProps {
  channels: Channel[];
  defaultChannel: Channel;
  currentChannel: Channel;
  setCurrentChannel: (slug: string) => void;
}

const [useContext, Provider] = createSafeContext<ChannelsConsumerProps>();

const ChannelsProvider = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();

  const [currentChannelSlug, setCurrentChannelSlug] = useState(
    router.query.channel
  );

  const setCurrentChannel = (channel: string) => {
    // todo: changing the channel should also clear the cart
    setCurrentChannelSlug(channel);
    apolloClient.clearStore();
  };

  const currentChannel =
    CHANNELS.find(({ slug }) => slug === currentChannelSlug) || DEFAULT_CHANNEL;

  const providerValues: ChannelsConsumerProps = {
    channels: CHANNELS,
    defaultChannel: DEFAULT_CHANNEL,
    currentChannel,
    setCurrentChannel: setCurrentChannel,
  };

  return <Provider value={providerValues}>{children}</Provider>;
};

export const useChannels = useContext;

export default ChannelsProvider;
