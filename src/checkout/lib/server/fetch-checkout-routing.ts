import "server-only";

import {
	CheckoutRoutingDocument,
	type CheckoutRoutingQuery,
	type CheckoutRoutingQueryVariables,
} from "@/checkout/graphql/generated/operations";
import type { CheckoutRoutingFetchResult } from "@/checkout/lib/checkout-types";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { executePublicGraphQL } from "@/lib/graphql";

const checkoutRoutingDocument = toTypedDocument<CheckoutRoutingQuery, CheckoutRoutingQueryVariables>(
	CheckoutRoutingDocument,
);

/** Lightweight checkout fetch for RSC routing only — full cart UI loads via `syncCheckoutFromServer`. */
export async function fetchCheckoutRoutingOnServer(checkoutId: string): Promise<CheckoutRoutingFetchResult> {
	const result = await executePublicGraphQL(checkoutRoutingDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
	});

	if (!result.ok) {
		if (process.env.NODE_ENV === "development") {
			console.error(
				"[fetchCheckoutRoutingOnServer] failed:",
				result.error.type,
				result.error.message || "(no message)",
				{ checkoutId },
			);
		}
		return { ok: false };
	}

	return { ok: true, checkout: result.data.checkout ?? null };
}
