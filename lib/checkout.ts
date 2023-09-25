import { CheckoutFindDocument } from "@/gql/graphql";
import { execute } from "@/lib";

export async function find(cart: string) {
  const { checkout } = cart ? await execute(CheckoutFindDocument, {
    variables: {
      token: cart,
    },
    cache: 'no-cache',
  }) : { checkout: null };

  return checkout;
}