import { CountryCode } from "@/checkout-storefront/graphql";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { DEFAULT_LOCALE, Locale } from "@/checkout-storefront/lib/regions";
import { getParsedLocaleData } from "@/checkout-storefront/lib/utils/locale";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useMemo, useState } from "react";

import EN_US from "../../content/compiled-locales/en-US.json";
import PL_PL from "../../content/compiled-locales/pl-PL.json";

const localeToMessages: Record<Locale, any> = {
  "en-US": EN_US,
  "pl-PL": PL_PL,
};

interface UseLocale {
  locale: Locale;
  countryCode: CountryCode;
  channel: string;
  messages: typeof localeToMessages[keyof typeof localeToMessages];
}

export const useLocale = (): UseLocale => {
  const { locale, countryCode } = getParsedLocaleData(getQueryParams().locale);

  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [currentCountryCode, setCurrentCountryCode] = useState<CountryCode>(countryCode);
  const [currentChannel, setCurrentChannel] = useState<string>(getQueryParams().channel);

  const messages = useMemo(
    () =>
      currentLocale in localeToMessages
        ? localeToMessages[currentLocale]
        : localeToMessages[DEFAULT_LOCALE],
    [currentLocale]
  );

  if (!messages) {
    console.warn(`Missing messages for locale: ${currentLocale}`);
  }

  const handleChange = ({ queryParams }: UrlChangeHandlerArgs) => {
    const newQuery = getParsedLocaleData(queryParams.locale);
    setCurrentLocale(newQuery.locale);
    setCurrentCountryCode(newQuery.countryCode);
    setCurrentChannel(queryParams.channel);
  };

  useUrlChange(handleChange);

  return useMemo(
    () => ({
      locale: currentLocale,
      countryCode: currentCountryCode,
      messages,
      channel: currentChannel,
    }),
    [currentCountryCode, currentLocale, messages, currentChannel]
  );
};
