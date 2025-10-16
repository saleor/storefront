"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";

type deleteLineFromCheckoutArgs = {
	lineId: string;
	checkoutId: string;
};

export const deleteLineFromCheckout = async ({ lineId, checkoutId }: deleteLineFromCheckoutArgs) => {
	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
};

type updateLineQuantityArgs = {
	lineId: string;
	checkoutId: string;
	quantity: number;
};

export const updateLineQuantity = async ({
	lineId,
	checkoutId,
	quantity,
}: updateLineQuantityArgs): Promise<{ success: boolean }> => {
	try {
		// Validate quantity
		if (quantity < 0 || quantity > 999 || !Number.isInteger(quantity)) {
			return { success: false };
		}

		// If quantity is 0, delete the line instead
		if (quantity === 0) {
			await deleteLineFromCheckout({ lineId, checkoutId });
			return { success: true };
		}

		const result = await executeGraphQL(CheckoutLinesUpdateDocument, {
			variables: {
				checkoutId,
				lines: [
					{
						lineId,
						quantity,
					},
				],
			},
			cache: "no-cache",
		});

		revalidatePath("/cart");

		return {
			success: !result.checkoutLinesUpdate?.errors?.length,
		};
	} catch (error) {
		console.error("Error updating line quantity:", error);
		return { success: false };
	}
};
