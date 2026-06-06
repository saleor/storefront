import "server-only";

import {
	ChannelDocument,
	type ChannelQuery,
	type ChannelQueryVariables,
} from "@/checkout/graphql/generated/operations";
import type { CountryCode } from "@/checkout/graphql";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { executePublicGraphQL } from "@/lib/graphql";

const channelQueryDocument = toTypedDocument<ChannelQuery, ChannelQueryVariables>(ChannelDocument);

export async function fetchChannelCountriesOnServer(channelSlug: string): Promise<CountryCode[]> {
	const result = await executePublicGraphQL(channelQueryDocument, {
		variables: { slug: channelSlug },
		cache: "no-cache",
	});

	if (!result.ok) {
		return [];
	}

	return (result.data.channel?.countries?.map(({ code }) => code) as CountryCode[]) ?? [];
}
