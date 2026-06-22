import { buildStorefrontPath } from "@/lib/storefront-path";

/** Query flag Saleor appends after `email` and `token` on account-confirmation links. */
export const ACCOUNT_CONFIRM_QUERY_PARAM = "confirm";

/**
 * Stable redirect URL for `accountRegister` — not tied to an ephemeral checkout id.
 * Saleor appends `&email=…&token=…` when sending the confirmation email.
 */
export function buildAccountConfirmationRedirectUrl(origin: string, locale: string, channel: string): string {
	const url = new URL(buildStorefrontPath(locale, channel, "/login"), origin);
	url.searchParams.set(ACCOUNT_CONFIRM_QUERY_PARAM, "1");
	return url.toString();
}

export function isAccountConfirmationLink(searchParams: Pick<URLSearchParams, "get">): boolean {
	return searchParams.get(ACCOUNT_CONFIRM_QUERY_PARAM) === "1";
}

export function getEmailAndTokenFromSearchParams(
	searchParams: Pick<URLSearchParams, "get">,
): { email: string; token: string } | null {
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	if (!email || !token) {
		return null;
	}

	return { email, token };
}
