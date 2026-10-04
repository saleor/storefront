import "server-only";

import {
	ChannelDocument,
	type ChannelQuery,
	type ChannelQueryVariables,
} from "@/checkout/graphql/generated/operations";
import type { CountryCode } from "@/checkout/graphql";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { fetchChannelDefaultCountryOnServer } from "@/checkout/lib/server/fetch-channel-default-country";
import { liveQuery } from "@/lib/saleor";

const channelQueryDocument = toTypedDocument<ChannelQuery, ChannelQueryVariables>(ChannelDocument);

export type ChannelCountriesResult = {
	countries: CountryCode[];
	defaultCountryCode: CountryCode | null;
};

export async function fetchChannelCountriesOnServer(channelSlug: string): Promise<ChannelCountriesResult> {
	const [result, defaultCountryCode] = await Promise.all([
		liveQuery(channelQueryDocument, {
			variables: { slug: channelSlug },
		}),
		fetchChannelDefaultCountryOnServer(channelSlug).catch(() => null),
	]);

	const channelDefault = (defaultCountryCode as CountryCode | null) ?? null;

	if (!result.ok) {
		return { countries: [], defaultCountryCode: channelDefault };
	}

	return {
		countries: (result.data.channel?.countries?.map(({ code }) => code) as CountryCode[]) ?? [],
		defaultCountryCode: channelDefault,
	};
}
