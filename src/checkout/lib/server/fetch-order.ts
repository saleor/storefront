import "server-only";

import {
	OrderDocument,
	type OrderQuery,
	type OrderQueryVariables,
} from "@/checkout/graphql/generated/operations";
import type { ServerOrder } from "@/checkout/lib/checkout-types";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { checkoutGraphqlLocaleVariables } from "@/lib/checkout-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import type { LocaleSlug } from "@/config/locale";

const orderQueryDocument = toTypedDocument<OrderQuery, OrderQueryVariables>(OrderDocument);

export type FetchOrderResult =
	| { status: "found"; order: ServerOrder }
	| { status: "miss" }
	| { status: "unavailable" };

/**
 * Fetch an order by Saleor id. Callers must sanitize before sending to the client.
 * A failed request is `unavailable`, not a miss — do not 404 a valid HMAC during an outage.
 */
export async function fetchOrderOnServer(
	orderId: string,
	localeSlug?: LocaleSlug,
): Promise<FetchOrderResult> {
	const result = await executePublicGraphQL(orderQueryDocument, {
		variables: {
			id: orderId,
			...(await checkoutGraphqlLocaleVariables(localeSlug)),
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { status: "unavailable" };
	}

	const order = result.data.order ?? null;
	return order ? { status: "found", order } : { status: "miss" };
}
