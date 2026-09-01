import { useCallback } from "react";

import type { CountryCode } from "@/checkout/graphql";
import { resolveBlankAddressCountryCode } from "@/checkout/lib/default-address-country";
import type { ChannelDefaultCountryCode, ShippingCountryOption } from "@/checkout/lib/checkout-types";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

interface UseAvailableShippingCountries {
	availableShippingCountries: ShippingCountryOption[];
	channelDefaultCountryCode: ChannelDefaultCountryCode;
	/** Existing address country if shippable, else channel.defaultCountry. */
	resolveBlankCountry: (existingCountryCode?: string | null) => CountryCode;
}

/** Channel countries — server-hydrated on the checkout page. */
export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { shippingCountries, channelDefaultCountryCode } = useCheckoutData();
	const resolveBlankCountry = useCallback(
		(existingCountryCode?: string | null) =>
			resolveBlankAddressCountryCode({
				existingCountryCode,
				channelDefaultCountryCode,
				availableCountryCodes: shippingCountries.map((country) => country.code),
			}),
		[shippingCountries, channelDefaultCountryCode],
	);

	return {
		availableShippingCountries: shippingCountries,
		channelDefaultCountryCode,
		resolveBlankCountry,
	};
};
