export type OrderViewAccess = "public" | "verified";

type OrderViewSanitizable = {
	userEmail?: string | null;
	shippingAddress?: unknown;
	billingAddress?: unknown;
	deliveryMethod?: unknown;
	voucher?: { code?: string | null } | null;
	fulfillments?: unknown;
	isPaid?: unknown;
	chargeStatus?: unknown;
	authorizeStatus?: unknown;
	totalBalance?: unknown;
	totalCaptured?: unknown;
};

/**
 * Strip PII before the order crosses to the client. Public = shop window
 * (lines + totals + status). Verified still drops voucher codes (cash).
 */
export function sanitizeOrderForClient<T extends OrderViewSanitizable>(order: T, access: OrderViewAccess): T {
	if (access === "public") {
		return {
			...order,
			userEmail: null,
			shippingAddress: null,
			billingAddress: null,
			deliveryMethod: null,
			voucher: null,
			fulfillments: [],
			isPaid: null,
			chargeStatus: null,
			authorizeStatus: null,
			totalBalance: null,
			totalCaptured: null,
		};
	}

	return {
		...order,
		voucher: null,
	};
}

export function billingCityCountry(
	address: {
		city?: string | null;
		country?: { country?: string | null } | null;
	} | null,
): string | null {
	if (!address) {
		return null;
	}

	const parts = [address.city, address.country?.country].filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : null;
}
