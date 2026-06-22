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

/**
 * Fetch order for confirmation page. Order ID in URL is the credential (public query).
 */
export async function fetchOrderOnServer(
	orderId: string,
	localeSlug?: LocaleSlug,
): Promise<ServerOrder | null> {
	const result = await executePublicGraphQL(orderQueryDocument, {
		variables: {
			id: orderId,
			...(await checkoutGraphqlLocaleVariables(localeSlug)),
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return null;
	}

	return result.data.order ?? null;
}
