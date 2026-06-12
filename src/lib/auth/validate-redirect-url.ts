import { headers } from "next/headers";

/**
 * Server-side allowlist for `redirectUrl` values forwarded to Saleor
 * (account confirmation and password reset emails). Clients send
 * `window.location.href` / `origin`, but an unauthenticated caller could POST
 * any URL — without this check the emails become a phishing vector.
 */

function configuredOrigins(): string[] {
	const origins: string[] = [];

	for (const value of [process.env.NEXT_PUBLIC_STOREFRONT_URL, process.env.NEXT_PUBLIC_CHECKOUT_URL]) {
		if (!value) {
			continue;
		}

		try {
			origins.push(new URL(value).origin);
		} catch {
			// Malformed env config — skip rather than crash auth flows.
		}
	}

	return origins;
}

/**
 * True when `redirectUrl` is http(s) and its origin matches this deployment
 * (`requestOrigin`) or a configured storefront/checkout origin.
 */
export function isAllowedRedirectUrl(redirectUrl: string, requestOrigin?: string | null): boolean {
	let parsed: URL;
	try {
		parsed = new URL(redirectUrl);
	} catch {
		return false;
	}

	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
		return false;
	}

	const allowed = configuredOrigins();
	if (requestOrigin) {
		allowed.push(requestOrigin);
	}

	return allowed.includes(parsed.origin);
}

/**
 * Origin of the current request as the server sees it (proxy-aware).
 * Works in both route handlers and server actions.
 */
export async function getRequestOrigin(): Promise<string | null> {
	const headerStore = await headers();
	const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

	if (!host) {
		return null;
	}

	const forwardedProto = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim();
	const isLocalHost = host.startsWith("localhost") || host.startsWith("127.");
	const proto = forwardedProto || (isLocalHost ? "http" : "https");

	return `${proto}://${host}`;
}
