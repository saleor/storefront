import { createHash, createHmac } from "node:crypto";

/**
 * The key for the hash. Kept server-side, so knowing an email is not enough to find its counter
 * in the store, or to tell which emails were tried.
 */
function hashSecret(): string | null {
	return (
		process.env.RATE_LIMIT_SECRET || process.env.ORDER_VIEW_SECRET || process.env.REVALIDATE_SECRET || null
	);
}

/**
 * A store key for something a visitor typed (an email, an order number), holding a keyed hash
 * of it rather than the value. Without any secret configured the hash is unkeyed.
 */
export function hashedKey(scope: string, value: string): string {
	const secret = hashSecret();
	const digest = secret
		? createHmac("sha256", `paper-rate-limit:${secret}`).update(value).digest("hex")
		: createHash("sha256").update(`paper-rate-limit:${value}`).digest("hex");
	return `${scope}:${digest.slice(0, 32)}`;
}

/** Emails are matched case-insensitively, so `Ann@x.com` and `ann@x.com ` share one counter. */
export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}
