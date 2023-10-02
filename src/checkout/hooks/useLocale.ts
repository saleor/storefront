import { useMemo, useState } from "react";
import EN_US from "../content/compiled-locales/en-US.json";
import { type CountryCode } from "@/checkout/graphql";
import { type UrlChangeHandlerArgs, useUrlChange } from "@/checkout/hooks/useUrlChange";
import { DEFAULT_LOCALE, type Locale } from "@/checkout/lib/regions";
import { getParsedLocaleData } from "@/checkout/lib/utils/locale";
import { getQueryParams } from "@/checkout/lib/utils/url";

const localeToMessages: Record<Locale, typeof EN_US> = {
	"en-US": EN_US,
};

interface UseLocale {
	locale: Locale;
	countryCode: CountryCode;
	channel: string;
	messages: (typeof localeToMessages)[keyof typeof localeToMessages];
}

export const useLocale = (): UseLocale => {
	const { locale, countryCode } = getParsedLocaleData(getQueryParams().locale);

	const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
	const [currentCountryCode, setCurrentCountryCode] = useState<CountryCode>(countryCode);
	const [currentChannel, setCurrentChannel] = useState<string>(getQueryParams().channel);

	const messages = useMemo(
		() =>
			currentLocale in localeToMessages ? localeToMessages[currentLocale] : localeToMessages[DEFAULT_LOCALE],
		[currentLocale],
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
		[currentCountryCode, currentLocale, messages, currentChannel],
	);
};
