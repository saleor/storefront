"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { signOutSession } from "@/lib/auth/bff-server";
import { revalidateAuthSurfaces } from "@/lib/auth/revalidate-auth-surfaces";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

function revalidateCart(channel: string) {
	revalidatePath(`/${channel}/cart`);
	revalidateAuthSurfaces(channel);
}

/** Invalidate cached storefront header and checkout shell. Call from server actions only — never during RSC render. */
export async function revalidateAuthLayout(channel: string) {
	revalidateAuthSurfaces(channel);
}

export async function logout() {
	"use server";
	const cookieStore = await cookies();

	for (const cookie of cookieStore.getAll()) {
		if (!cookie.name.startsWith("checkoutId-") || !cookie.value) {
			continue;
		}
		await Checkout.detachCustomer(cookie.value);
	}

	await signOutSession();
	revalidatePath("/", "layout");
	revalidatePath("/checkout");
}

export async function saveCheckoutId(channel: string, checkoutId: string) {
	await Checkout.saveIdToCookie(channel, checkoutId);
}

/**
 * Clear the checkout cookie after a successful order.
 * Call after checkoutComplete succeeds — typically after navigating to order confirmation.
 * Never revalidates `/checkout` (that remounts the flow and resets the step mid-payment).
 */
export async function clearCheckout(channel: string) {
	"use server";
	await Checkout.clearCheckoutCookie(channel);
	revalidatePath(`/${channel}/cart`);
	revalidatePath(`/${channel}`, "layout");
}

export async function deleteCartLine(checkoutId: string, lineId: string, channel: string) {
	const result = await executeAuthenticatedGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	if (result.ok) {
		const checkout = result.data.checkoutLinesDelete?.checkout;
		if (checkout && checkout.lines.length === 0) {
			await Checkout.clearCheckoutCookie(checkout.channel.slug);
		}
	}

	revalidateCart(channel);
}

export async function updateCartLineQuantity(
	checkoutId: string,
	lineId: string,
	quantity: number,
	channel: string,
) {
	if (quantity < 1) {
		return deleteCartLine(checkoutId, lineId, channel);
	}

	await executeAuthenticatedGraphQL(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
	});

	revalidateCart(channel);
}
