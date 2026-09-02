import type { CountryCode } from "@/checkout/graphql";

/**
 * Last resort when the channel has no shippable countries (broken config).
 * Prefer {@link resolveBlankAddressCountryCode} over using this directly.
 */
export const FALLBACK_ADDRESS_COUNTRY: CountryCode = "US";

/**
 * Country to preselect on an empty shipping/billing form.
 *
 * Order: existing address country (if still shippable) → channel.defaultCountry
 * (if shippable) → first listed country → hardcoded fallback.
 *
 * An empty `availableCountryCodes` means the country fetch failed, not that
 * nothing is shippable — an existing address country is trusted as-is then.
 *
 * Do not use `countries[0]` / locale-sorted first country — that is Afghanistan
 * for a worldwide channel.
 */
export function resolveBlankAddressCountryCode({
	existingCountryCode,
	channelDefaultCountryCode,
	availableCountryCodes,
}: {
	existingCountryCode?: string | null;
	channelDefaultCountryCode?: string | null;
	availableCountryCodes: readonly string[];
}): CountryCode {
	const available = new Set(availableCountryCodes);

	if (existingCountryCode && (available.size === 0 || available.has(existingCountryCode))) {
		return existingCountryCode as CountryCode;
	}

	if (channelDefaultCountryCode && available.has(channelDefaultCountryCode)) {
		return channelDefaultCountryCode as CountryCode;
	}

	if (availableCountryCodes[0]) {
		return availableCountryCodes[0] as CountryCode;
	}

	if (channelDefaultCountryCode) {
		return channelDefaultCountryCode as CountryCode;
	}

	return FALLBACK_ADDRESS_COUNTRY;
}
