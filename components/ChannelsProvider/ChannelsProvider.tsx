import { useRouter } from "next/router";
import React, { createContext, useState } from "react";

import apolloClient from "@/lib/graphql";
import { Channel, CHANNELS, DEFAULT_CHANNEL } from "@/lib/regions";

export interface ChannelsConsumerProps {
  channels: Channel[];
  defaultChannel: Channel;
  currentChannel: Channel;
  setCurrentChannel: (slug: string) => void;
}

export const ChannelsContext = createContext<ChannelsConsumerProps>({
  channels: CHANNELS,
  defaultChannel: DEFAULT_CHANNEL,
  currentChannel: DEFAULT_CHANNEL,
  setCurrentChannel: () => {},
});

const ChannelsProvider: React.FC = ({ children }) => {
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

  return (
    <ChannelsContext.Provider value={providerValues}>
      {children}
    </ChannelsContext.Provider>
  );
};

export default ChannelsProvider;
