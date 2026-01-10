"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";

export async function deleteCartLine(checkoutId: string, lineId: string) {
	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

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
