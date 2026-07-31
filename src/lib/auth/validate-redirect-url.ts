/**
 * Server-side allowlist for `redirectUrl` values forwarded to Saleor
 * (account confirmation and password reset emails). Clients send
 * `window.location.href` / `origin`, but an unauthenticated caller could POST
 * any URL — without this check the emails become a phishing vector.
 */
function configuredOrigins(): string[] {
	const origins: string[] = [];

	// Constructs the allow-list based on the configured frontend URLs and extra allowed
	// origins
	const configuredValues = [
		process.env.NEXT_PUBLIC_STOREFRONT_URL,
		process.env.NEXT_PUBLIC_CHECKOUT_URL,
		...(process.env.ALLOWED_EXTRA_ORIGINS?.split(",") ?? []),
	];

	// Add VERCEL_URL if set - but prepend https protocol as it's not included
	// by default (https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_URL)
	if (process.env?.VERCEL_URL) {
		configuredValues.push(`https://${process.env.VERCEL_URL}`);
	}
	if (process.env?.VERCEL_PROJECT_PRODUCTION_URL) {
		configuredValues.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
	}
	if (process.env?.VERCEL_BRANCH_URL) {
		configuredValues.push(`https://${process.env.VERCEL_BRANCH_URL}`);
	}

	// Validates & normalizes the values
	for (const origin of configuredValues) {
		if (!origin) {
			continue;
		}
		try {
			origins.push(new URL(origin).origin);
		} catch (e) {
			throw new Error(`ALLOWED_EXTRA_ORIGINS contains an invalid value '${origin}': ${e}`);
		}
	}
	return origins;
}

function isLoopbackOrigin(origin: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(origin);
	} catch {
		return false;
	}

	return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]";
}

/**
 * True when `redirectUrl` is http(s) and its origin matches a configured
 * storefront/checkout/extra origin. In development, loopback redirect origins
 * are also accepted for local auth flows.
 */
export function isAllowedRedirectUrl(redirectUrl: string): boolean {
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

	// When in development mode, allows redirecting to localhost
	// IMPORTANT: this only allows loopback origins when not in production.
	//            This shouldn't be changed as this could allow spoofing.
	if (process.env.NODE_ENV !== "production" && isLoopbackOrigin(parsed.origin)) {
		allowed.push(parsed.origin);
	}

	return allowed.includes(parsed.origin);
}
