import "server-only";

import {
	OrdersByNumberDocument,
	type OrdersByNumberQuery,
	type OrdersByNumberQueryVariables,
} from "@/checkout/graphql/generated/operations";
import {
	classifyOrdersByNumberQuery,
	type ClassifiedOrdersByNumber,
} from "@/checkout/lib/classify-orders-by-number";
import type { ServerOrder } from "@/checkout/lib/checkout-types";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { checkoutGraphqlLocaleVariables } from "@/lib/checkout-locale";
import { executeAppGraphQL } from "@/lib/graphql";
import type { LocaleSlug } from "@/config/locale";

const ordersByNumberDocument = toTypedDocument<OrdersByNumberQuery, OrdersByNumberQueryVariables>(
	OrdersByNumberDocument,
);

export type OrderNumberLookup = ClassifiedOrdersByNumber<ServerOrder>;

/** Staff/app lookup — requires SALEOR_APP_TOKEN with MANAGE_ORDERS. */
export async function fetchOrderByNumberOnServer(
	number: number,
	localeSlug?: LocaleSlug,
): Promise<OrderNumberLookup> {
	if (!process.env.SALEOR_APP_TOKEN) {
		return { status: "unavailable" };
	}

	const result = await executeAppGraphQL(ordersByNumberDocument, {
		variables: {
			number,
			...(await checkoutGraphqlLocaleVariables(localeSlug)),
		},
		cache: "no-cache",
	});

	return classifyOrdersByNumberQuery(result);
}

export function isOrderNumberLookupAvailable(): boolean {
	return Boolean(process.env.SALEOR_APP_TOKEN);
}
