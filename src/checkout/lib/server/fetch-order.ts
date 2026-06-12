import "server-only";

import {
	OrderDocument,
	type OrderQuery,
	type OrderQueryVariables,
} from "@/checkout/graphql/generated/operations";
import type { ServerOrder } from "@/checkout/lib/checkout-types";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { localeConfig } from "@/config/locale";
import { executePublicGraphQL } from "@/lib/graphql";

const orderQueryDocument = toTypedDocument<OrderQuery, OrderQueryVariables>(OrderDocument);

/**
 * Fetch order for confirmation page. Order ID in URL is the credential (public query).
 */
export async function fetchOrderOnServer(orderId: string): Promise<ServerOrder | null> {
	const result = await executePublicGraphQL(orderQueryDocument, {
		variables: {
			id: orderId,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return null;
	}

	return result.data.order ?? null;
}
