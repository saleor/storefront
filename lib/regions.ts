import * as storefrontConfig from "../storefront.config";

export const CHANNEL_SLUG_KEY = "channelSlug";

export interface Channel {
  slug: string;
  name: string;
  currencyCode: string;
}

export const {
  defaultChannel: DEFAULT_CHANNEL,
  defaultLocale: DEFAULT_LOCALE,
} = storefrontConfig;

export const CHANNELS: Channel[] = [
  DEFAULT_CHANNEL,
  ...storefrontConfig.channels,
];

export const LOCALES = [DEFAULT_LOCALE, ...storefrontConfig.locales];

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
