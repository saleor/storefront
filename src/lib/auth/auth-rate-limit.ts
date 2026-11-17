import {
	clientIpFromHeaders,
	consumeAttempt,
	hashedKey,
	normalizeEmail,
	type Limit,
	type LimitOutcome,
} from "@/lib/rate-limit";

type AuthAction = "login" | "register" | "set-password" | "reset-password" | "confirm-account";
type AccountAction = "login" | "reset-password";

const DEFAULT_LIMIT: Limit = { limit: 10, windowMs: 15 * 60 * 1000 };
/** Per IP, for routes that send email. */
export const REGISTER_IP_LIMIT: Limit = { limit: 5, windowMs: 60 * 60 * 1000 };
export const RESET_PASSWORD_IP_LIMIT: Limit = { limit: 5, windowMs: 60 * 60 * 1000 };

/**
 * Per account, from any IP. Every attempt counts, before Saleor is asked, so parallel requests
 * from many IPs cannot all pass. Each is set above what one IP may send in the same time, so a
 * single IP cannot keep someone locked out; spreading the work over several IPs still can, which
 * is the price of stopping distributed guessing.
 */
export const ACCOUNT_LIMITS: Record<AccountAction, Limit> = {
	/** Sign-in attempts per account (one IP may send 10 per 15 minutes). */
	login: { limit: 20, windowMs: 15 * 60 * 1000 },
	/** Reset emails per account, so nobody can flood an inbox. */
	"reset-password": { limit: 5, windowMs: 60 * 60 * 1000 },
};

/*
 * Counts are shared across server instances (see `@/lib/rate-limit`). If the shared store is
 * missing or down, auth limits count in this instance's memory instead, so sign-in never stops.
 */

export function getClientIp(request: Request): string {
	return clientIpFromHeaders(request.headers);
}

export function rateLimitResponse(retryAfterSeconds: number): Response {
	return Response.json(
		{
			errors: [
				{
					message: "Too many attempts. Please try again later.",
					code: "RATE_LIMITED",
				},
			],
		},
		{
			status: 429,
			headers: { "Retry-After": String(retryAfterSeconds) },
		},
	);
}

function responseFor(outcome: LimitOutcome): Response | null {
	if (outcome.ok) return null;
	return rateLimitResponse(outcome.reason === "limited" ? outcome.retryAfterSeconds : 60);
}

/** Count an auth attempt from this IP (for server actions, which have headers, not a Request). */
export function limitAuthAttempt(action: AuthAction, ip: string, limit: Limit = DEFAULT_LIMIT) {
	return consumeAttempt(`${action}:${ip}`, limit, "memory");
}

/** Count an attempt against this account, whichever IP it comes from. */
export function limitAccountAttempt(action: AccountAction, email: string) {
	return consumeAttempt(
		hashedKey(`${action}-email`, normalizeEmail(email)),
		ACCOUNT_LIMITS[action],
		"memory",
	);
}

/** Returns a 429 response when the client exceeds the auth route's per-IP limit. */
export async function rejectIfRateLimited(
	request: Request,
	action: AuthAction,
	limit: Limit = DEFAULT_LIMIT,
): Promise<Response | null> {
	return responseFor(await limitAuthAttempt(action, getClientIp(request), limit));
}

/** Returns a 429 response when this account has had too many attempts. */
export async function rejectIfAccountLimited(action: AccountAction, email: string): Promise<Response | null> {
	return responseFor(await limitAccountAttempt(action, email));
}
