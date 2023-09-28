import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { execute } from "@/lib";

export async function find(checkoutId: string) {
	const { checkout } = checkoutId
		? await execute(CheckoutFindDocument, {
				variables: {
					id: checkoutId,
				},
				cache: "no-cache",
		  })
		: { checkout: null };

	return checkout;
}

export const create = () => execute(CheckoutCreateDocument);
