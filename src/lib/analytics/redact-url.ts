/**
 * Strip secrets and PII from a URL before it leaves the browser for an analytics
 * destination (Web Analytics `beforeSend` today; tag `page_location` later).
 *
 * Paper URLs carry bearer-like values in plain sight: `?checkout=<id>` loads that
 * checkout for anyone holding it, `/order/<token>` is an HMAC-signed guest order
 * view, Stripe return trips append `payment_intent_client_secret`, account
 * confirmation links carry `email` + `token`. None of those belong in a
 * third-party dashboard. Search terms (`?query=`) are free text that shoppers
 * paste anything into, so they are dropped too — search insight is emitted as a
 * structured event (with a zero-result flag), not read off the URL.
 *
 * Redaction only: this never drops an event. Sampling is a separate decision.
 */

/** Query params dropped by exact name. Benign navigation params (`step`, `locale`, `variant`, `sort`, `cursor`) stay. */
const DROPPED_QUERY_PARAMS: ReadonlySet<string> = new Set([
	"checkout",
	"order",
	"query",
	"email",
	"token",
	"payment_intent",
	"payment_intent_client_secret",
	"setup_intent",
	"setup_intent_client_secret",
	"redirect_status",
]);

/** Any param whose *name* smells like a credential is dropped regardless of the allowlist above. */
const SENSITIVE_PARAM_NAME = /secret|token|password|email|session|auth/i;

const ORDER_KEY_PLACEHOLDER = "/order/[key]";
/** `/order/<key>` on the checkout surface; `/order/find` is the static lookup page and is left alone. */
const ORDER_KEY_PATH = /^\/order\/(?!find(?:\/|$))[^/]+/;

export function redactAnalyticsUrl(url: string): string {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		// Not an absolute URL (should not happen for a browser location). Fail
		// closed: keep the path, drop everything that could carry a value.
		return url.split(/[?#]/, 1)[0] ?? "";
	}

	parsed.pathname = parsed.pathname.replace(ORDER_KEY_PATH, ORDER_KEY_PLACEHOLDER);

	for (const name of [...parsed.searchParams.keys()]) {
		if (DROPPED_QUERY_PARAMS.has(name) || SENSITIVE_PARAM_NAME.test(name)) {
			parsed.searchParams.delete(name);
		}
	}

	parsed.hash = "";

	return parsed.toString();
}
