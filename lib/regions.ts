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
