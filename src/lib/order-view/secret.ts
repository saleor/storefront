import "server-only";

/** HMAC secret for guest order-view tokens. Fail closed in production. */
export function getOrderViewSecret(): string {
	const secret = process.env.ORDER_VIEW_SECRET || process.env.REVALIDATE_SECRET;

	if (secret) {
		return secret;
	}

	if (process.env.NODE_ENV === "production") {
		throw new Error("ORDER_VIEW_SECRET or REVALIDATE_SECRET is required to sign order-view tokens");
	}

	return "dev-order-view-secret-not-for-production";
}
