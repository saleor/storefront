import { timingSafeEqual, createHmac } from "crypto";
import { NextRequest } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const WEBHOOK_SECRET = process.env.SALEOR_WEBHOOK_SECRET;

// ---------------------------------------------------------------------------
// Secret verification (timing-safe)
// ---------------------------------------------------------------------------

let secretLengthWarned = false;

export function verifySecret(provided: string | null | undefined): boolean {
	if (!provided || !REVALIDATE_SECRET) return false;

	if (!secretLengthWarned && REVALIDATE_SECRET.length < 32 && process.env.NODE_ENV === "production") {
		secretLengthWarned = true;
		console.warn("[Security] REVALIDATE_SECRET should be at least 32 characters for production use");
	}

	try {
		const a = new Uint8Array(Buffer.from(provided));
		const b = new Uint8Array(Buffer.from(REVALIDATE_SECRET));
		if (a.length !== b.length) return false;
		return timingSafeEqual(a, b);
	} catch {
		return false;
	}
}

/**
 * Extract the bearer token from the Authorization header.
 * Falls back to x-revalidate-secret header, then query-string `?secret=` (deprecated).
 */
export function extractBearerToken(request: NextRequest): string | null {
	const authHeader = request.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.slice(7);
	}

	const headerSecret = request.headers.get("x-revalidate-secret");
	if (headerSecret) return headerSecret;

	const querySecret = request.nextUrl.searchParams.get("secret");
	if (querySecret) {
		console.warn(
			"[Security] Secret passed via query string is deprecated. Use `Authorization: Bearer <token>` header instead.",
		);
		return querySecret;
	}

	return null;
}

// ---------------------------------------------------------------------------
// Webhook HMAC verification
// ---------------------------------------------------------------------------

export function verifyWebhookSignature(payload: string, signature: string | null): boolean {
	if (!WEBHOOK_SECRET || !signature) return false;

	const hmac = createHmac("sha256", WEBHOOK_SECRET);
	hmac.update(payload);
	const expectedSignature = hmac.digest("hex");

	try {
		return timingSafeEqual(
			new Uint8Array(Buffer.from(signature)),
			new Uint8Array(Buffer.from(expectedSignature)),
		);
	} catch {
		return false;
	}
}
