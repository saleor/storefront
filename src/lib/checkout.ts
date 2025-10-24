import { cookies } from "next/headers";
import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { DEFAULT_CHANNEL } from "@/app/config";

export async function getIdFromCookies() {
	const cookieName = `checkoutId-${DEFAULT_CHANNEL}`;
	const checkoutId = (await cookies()).get(cookieName)?.value || "";
	return checkoutId;
}

export async function saveIdToCookie(checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = `checkoutId-${DEFAULT_CHANNEL}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function find(checkoutId: string) {
	try {
		const { checkout } = checkoutId
			? await executeGraphQL(CheckoutFindDocument, {
					variables: {
						id: checkoutId,
					},
					cache: "no-cache",
				})
			: { checkout: null };

		return checkout;
	} catch {
		// we ignore invalid ID or checkout not found
	}
}

export async function findOrCreate({ checkoutId }: { checkoutId?: string } = {}) {
	if (!checkoutId) {
		return (await create()).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create()).checkoutCreate?.checkout;
}

export const create = () =>
	executeGraphQL(CheckoutCreateDocument, { cache: "no-cache", variables: { channel: DEFAULT_CHANNEL } });
