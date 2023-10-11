"use server";

import { revalidatePath } from "next/cache";
import { execute } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument } from "@/gql/graphql";

type deleteLineFromCheckoutArgs = {
	lineId: string;
	checkoutId: string;
};

export const deleteLineFromCheckout = async ({ lineId, checkoutId }: deleteLineFromCheckoutArgs) => {
	await execute(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
	});

	revalidatePath("/cart");
};
