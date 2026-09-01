import "server-only";

import type { CountryCode } from "@/checkout/graphql";
import { executeRawGraphQL } from "@/lib/graphql";

const CHANNEL_DEFAULT_COUNTRY_QUERY = `
	query ChannelDefaultCountry($slug: String!) {
		channel(slug: $slug) {
			defaultCountry {
				code
			}
		}
	}
`;

type ChannelDefaultCountryData = {
	channel?: {
		defaultCountry?: { code?: string | null } | null;
	} | null;
};

/**
 * Saleor `channel.defaultCountry` — staff/app field.
 *
 * Uses a raw app-token query (no codegen document). Generated checkout operations
 * are gitignored; a new `ChannelDefaultCountryDocument` export left running
 * `next dev` processes on a stale `operations.ts` and crashed every checkout RSC
 * refresh — including after guest Continue.
 */
export async function fetchChannelDefaultCountryOnServer(channelSlug: string): Promise<CountryCode | null> {
	const token = process.env.SALEOR_APP_TOKEN;
	if (!token) {
		return null;
	}

	try {
		const result = await executeRawGraphQL<ChannelDefaultCountryData>({
			query: CHANNEL_DEFAULT_COUNTRY_QUERY,
			variables: { slug: channelSlug },
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!result.ok) {
			return null;
		}

		return (result.data.channel?.defaultCountry?.code as CountryCode) ?? null;
	} catch {
		return null;
	}
}
