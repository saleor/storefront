import { GetStaticPropsContext } from "next";

import { LanguageCodeEnum } from "./../saleor/api";

export const LOCALES = [
  { slug: "en-US", code: LanguageCodeEnum.EnUs, name: "American English" },
  { slug: "pl-PL", code: LanguageCodeEnum.PlPl, name: "Polski" },
];
export const DEFAULT_LOCALE = "en-US";

export const CHANNEL_SLUG_KEY = "channelSlug";

export interface Channel {
  slug: string;
  name: string;
  currencyCode: string;
}

export const DEFAULT_CHANNEL: Channel = {
  slug: "default-channel",
  name: "United States Dollar",
  currencyCode: "USD",
};

export const CHANNELS: Channel[] = [
  DEFAULT_CHANNEL,
  {
    slug: "channel-pln",
    name: "Polski Złoty",
    currencyCode: "PLN",
  },
  {
    slug: "channel-gbp",
    name: "British Pound Sterling",
    currencyCode: "GBP",
  },
];

export interface RegionCombination {
  channelSlug: string;
  localeSlug: string;
}

export const regionCombinations = () => {
  const combinations: RegionCombination[] = [];
  CHANNELS.forEach((channel) => {
    LOCALES.forEach((locale) => {
      combinations.push({ channelSlug: channel.slug, localeSlug: locale.slug });
    });
  });
  return combinations;
};

export interface Path<T> {
  params: T;
}

export const localeToEnum = (localeSlug: string): LanguageCodeEnum => {
  const chosenLocale = LOCALES.find(({ slug }) => slug === localeSlug)?.code;
  if (chosenLocale) {
    return chosenLocale;
  }
  return (
    LOCALES.find(({ slug }) => slug === DEFAULT_LOCALE)?.code ||
    LanguageCodeEnum.EnUs
  );
};

export const contextToRegionQuery = (context: GetStaticPropsContext) => {
  return {
    channel: context.params?.channel?.toString() || DEFAULT_CHANNEL.slug,
    locale: localeToEnum(context.params?.locale?.toString() || DEFAULT_LOCALE),
  };
};

export const languageCodeToLocale = (locale: string) => {
  // Converts locale from EN_US to en-US
  const splitted = locale.split("_");
  splitted[0] = splitted[0].toLowerCase();
  return splitted.join("-");
};
