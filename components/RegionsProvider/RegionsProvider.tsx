import { useRouter } from "next/router";
import React, { PropsWithChildren, useState } from "react";
import { IntlProvider } from "react-intl";

import apolloClient from "@/lib/graphql";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import {
  Channel,
  CHANNELS,
  DEFAULT_CHANNEL,
  DEFAULT_LOCALE,
  localeToEnum,
} from "@/lib/regions";
import createSafeContext from "@/lib/useSafeContext";
import { formatAsMoney } from "@/lib/util";
import { LanguageCodeEnum, PriceFragment } from "@/saleor/api";

import * as sourceOfTruth from "../../locale/en-US.json";
import * as pl from "../../locale/pl-PL.json";

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
  formatPrice: (price?: PriceFragment) => string;
}

export const [useContext, Provider] = createSafeContext<RegionsConsumerProps>();

export type LocaleMessages = typeof sourceOfTruth;
export type LocaleKey = keyof LocaleMessages;
export function importMessages(locale: string): LocaleMessages {
  switch (locale) {
    case "en-US":
      return sourceOfTruth;
    case "pl-PL":
      return pl;
    default:
      return sourceOfTruth;
  }
}
export const RegionsProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const { resetCheckoutToken } = useCheckout();

  const [currentChannelSlug, setCurrentChannelSlug] = useState(
    router.query.channel
  );

  const setCurrentChannel = (channel: string) => {
    resetCheckoutToken();
    setCurrentChannelSlug(channel);
    apolloClient.clearStore();
  };

  const locale = router.query.locale?.toString() || DEFAULT_LOCALE;

  const currentChannel =
    CHANNELS.find(({ slug }) => slug === currentChannelSlug) || DEFAULT_CHANNEL;

  const formatPrice = (price?: PriceFragment) => {
    return formatAsMoney(
      price?.amount || 0,
      price?.currency || currentChannel.currencyCode,
      locale
    );
  };

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
    formatPrice,
  };

  const msgs = importMessages(locale);

  return (
    <Provider value={providerValues}>
      <IntlProvider
        messages={msgs}
        locale={locale}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </IntlProvider>
    </Provider>
  );
};

export const useRegions = useContext;

export default RegionsProvider;
