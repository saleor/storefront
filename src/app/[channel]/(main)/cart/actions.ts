"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";

// Validation schemas
const deleteLineSchema = z.object({
	lineId: z.string().min(1, "Line ID is required"),
	checkoutId: z.string().min(1, "Checkout ID is required"),
});

const updateLineQuantitySchema = z.object({
	lineId: z.string().min(1, "Line ID is required"),
	checkoutId: z.string().min(1, "Checkout ID is required"),
	quantity: z.number().int("Quantity must be an integer").min(0, "Quantity must be non-negative").max(999, "Quantity cannot exceed 999"),
});

type deleteLineFromCheckoutArgs = z.infer<typeof deleteLineSchema>;

export const deleteLineFromCheckout = async (args: deleteLineFromCheckoutArgs) => {
	// Validate input
	const validated = deleteLineSchema.parse(args);

	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId: validated.checkoutId,
			lineIds: [validated.lineId],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
};

type updateLineQuantityArgs = z.infer<typeof updateLineQuantitySchema>;

export const updateLineQuantity = async (args: updateLineQuantityArgs): Promise<{ success: boolean }> => {
	try {
		// Validate input with Zod
		const validated = updateLineQuantitySchema.parse(args);

		// If quantity is 0, delete the line instead
		if (validated.quantity === 0) {
			await deleteLineFromCheckout({ lineId: validated.lineId, checkoutId: validated.checkoutId });
			return { success: true };
		}

		const result = await executeGraphQL(CheckoutLinesUpdateDocument, {
			variables: {
				checkoutId: validated.checkoutId,
				lines: [
					{
						lineId: validated.lineId,
						quantity: validated.quantity,
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
