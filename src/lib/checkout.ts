import { cookies } from "next/headers";
import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";

export async function getIdFromCookies(channel: string) {
	try {
		const cookieName = `checkoutId-${channel}`;
		const checkoutId = (await cookies()).get(cookieName)?.value || "";
		return checkoutId;
	} catch {
		// During static generation, cookies() throws - return empty string
		return "";
	}
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function clearCheckoutCookie(channel: string) {
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).delete(cookieName);
}

export async function find(checkoutId: string) {
	if (!checkoutId) {
		return null;
	}

	const result = await executeAuthenticatedGraphQL(CheckoutFindDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
	});

	// Return null on error or if checkout not found
	return result.ok ? result.data.checkout : null;
}

export async function findOrCreate({ channel, checkoutId }: { checkoutId?: string; channel: string }) {
	if (!checkoutId) {
		const result = await create({ channel });
		return result.ok ? result.data.checkoutCreate?.checkout : null;
	}

	const checkout = await find(checkoutId);
	if (checkout) {
		return checkout;
	}

	const result = await create({ channel });
	return result.ok ? result.data.checkoutCreate?.checkout : null;
}

export const create = ({ channel }: { channel: string }) =>
	executeAuthenticatedGraphQL(CheckoutCreateDocument, { cache: "no-cache", variables: { channel } });
