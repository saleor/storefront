import type { ChannelSelectOption } from "@/config/channels";

export type MarketSelectOption = ChannelSelectOption & {
	/** Human market name when slug maps to a region, otherwise title-cased slug */
	regionLabel: string;
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/** Map channel slug to a display region name when possible (e.g. `uk` → United Kingdom). */
export function getMarketRegionLabel(slug: string): string {
	if (slug.length === 2) {
		const region = regionNames.of(slug.toUpperCase());
		if (region) return region;
	}

	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function enrichMarketOptions(channels: ChannelSelectOption[]): MarketSelectOption[] {
	return channels.map((channel) => ({
		...channel,
		regionLabel: getMarketRegionLabel(channel.slug),
	}));
}

/** Narrow currency symbol for compact trigger labels. */
export function getCurrencySymbol(currencyCode: string, localeBcp47: string): string {
	try {
		const parts = new Intl.NumberFormat(localeBcp47, {
			style: "currency",
			currency: currencyCode,
			currencyDisplay: "narrowSymbol",
		}).formatToParts(0);
		return parts.find((part) => part.type === "currency")?.value ?? currencyCode;
	} catch {
		return currencyCode;
	}
}
