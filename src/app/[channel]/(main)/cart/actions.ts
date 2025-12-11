"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutUpdateLineDocument } from "@/gql/graphql";

type DeleteLineArgs = {
	lineId: string;
	checkoutId: string;
};

export const deleteLineFromCheckout = async ({ lineId, checkoutId }: DeleteLineArgs) => {
	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
};

type UpdateLineQuantityArgs = {
	checkoutId: string;
	lineId: string;
	quantity: number;
};

export const updateLineQuantity = async ({ checkoutId, lineId, quantity }: UpdateLineQuantityArgs) => {
	if (quantity < 1) {
		return deleteLineFromCheckout({ checkoutId, lineId });
	}

	await executeGraphQL(CheckoutUpdateLineDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
};
