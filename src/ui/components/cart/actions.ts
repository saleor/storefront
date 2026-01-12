"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

export async function deleteCartLine(checkoutId: string, lineId: string) {
	const result = await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	// If cart is now empty, clear the checkout cookie to start fresh next time
	const checkout = result.checkoutLinesDelete?.checkout;
	if (checkout && checkout.lines.length === 0) {
		await Checkout.clearCheckoutCookie(checkout.channel.slug);
	}

	revalidatePath("/cart");
	revalidatePath("/");
}

export async function updateCartLineQuantity(checkoutId: string, lineId: string, quantity: number) {
	if (quantity < 1) {
		return deleteCartLine(checkoutId, lineId);
	}

	await executeGraphQL(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
	revalidatePath("/");
}
