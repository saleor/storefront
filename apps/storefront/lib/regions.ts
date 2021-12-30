export const LOCALES = ["en-US", "fr-fr", "pl-pl"];
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
      combinations.push({ channelSlug: channel.slug, localeSlug: locale });
    });
  });
  return combinations;
};

export interface Path<T> {
  params: T;
}
