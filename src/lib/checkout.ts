import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function find(checkoutId: string) {
	const { checkout } = checkoutId
		? await executeGraphQL(CheckoutFindDocument, {
				variables: {
					id: checkoutId,
				},
				cache: "no-cache",
		  })
		: { checkout: null };

	return checkout;
}

export const create = () => executeGraphQL(CheckoutCreateDocument, { cache: "no-cache" });
