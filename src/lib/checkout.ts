import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

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

export async function findOrCreate(checkoutId?: string) {
	if (!checkoutId) {
		return (await create()).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create()).checkoutCreate?.checkout;
}

export const create = () => executeGraphQL(CheckoutCreateDocument, { cache: "no-cache" });
