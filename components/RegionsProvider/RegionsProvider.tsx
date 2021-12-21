import { useRouter } from "next/router";
import React, { useState } from "react";

import apolloClient from "@/lib/graphql";
import {
  Channel,
  CHANNELS,
  DEFAULT_CHANNEL,
  DEFAULT_LOCALE,
  localeToEnum,
} from "@/lib/regions";
import createSafeContext from "@/lib/useSafeContext";
import { LanguageCodeEnum } from "@/saleor/api";

export interface RegionsConsumerProps {
  channels: Channel[];
  defaultChannel: Channel;
  currentChannel: Channel;
  currentLocale: string;
  query: {
    channel: string;
    locale: LanguageCodeEnum;
  };
  setCurrentChannel: (slug: string) => void;
}

export const [useContext, Provider] = createSafeContext<RegionsConsumerProps>();

export const RegionsProvider: React.FC = ({ children }) => {
  const router = useRouter();

  const [currentChannelSlug, setCurrentChannelSlug] = useState(
    router.query.channel
  );

  const setCurrentChannel = (channel: string) => {
    // TODO: changing the channel should also clear the cart
    setCurrentChannelSlug(channel);
    apolloClient.clearStore();
  };

  const locale = router.query.locale?.toString() || DEFAULT_LOCALE;

  const currentChannel =
    CHANNELS.find(({ slug }) => slug === currentChannelSlug) || DEFAULT_CHANNEL;

  const providerValues: RegionsConsumerProps = {
    channels: CHANNELS,
    defaultChannel: DEFAULT_CHANNEL,
    currentChannel,
    setCurrentChannel: setCurrentChannel,
    currentLocale: locale,
    query: {
      channel: currentChannel.slug,
      locale: localeToEnum(locale),
    },
  };

  return <Provider value={providerValues}>{children}</Provider>;
};

export const useRegions = useContext;

export default RegionsProvider;
