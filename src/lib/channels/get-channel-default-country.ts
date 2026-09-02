import { getCachedChannelsList } from "@/lib/channels/get-channels-data";

/**
 * Saleor `channel.defaultCountry` — staff/app field, so this reads the cached
 * `ChannelsList` (app token). Returns null without `SALEOR_APP_TOKEN`.
 */
export function findChannelDefaultCountryCode(
	channels: ReadonlyArray<{ slug: string; defaultCountry?: { code: string } | null }> | null | undefined,
	channelSlug: string,
): string | null {
	return channels?.find((channel) => channel.slug === channelSlug)?.defaultCountry?.code ?? null;
}

export async function getChannelDefaultCountryCode(channelSlug: string): Promise<string | null> {
	const data = await getCachedChannelsList();
	return findChannelDefaultCountryCode(data?.channels, channelSlug);
}
