import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  CheckoutDocument,
  CheckoutQuery,
  CheckoutQueryVariables,
  OrderCreateDocument,
  OrderCreateMutation,
  OrderCreateMutationVariables,
  OrderFragment,
} from "@/saleor-app-checkout/graphql";
import * as Apl from "@/saleor-app-checkout/config/apl";

import { Errors } from "./types";

type CreateOrderResult =
  | {
      data: OrderFragment;
    }
  | {
      errors: Errors;
    };

export const createOrder = async ({
  saleorApiUrl,
  checkoutId,
  totalAmount,
}: {
  saleorApiUrl: string;
  checkoutId: string;
  totalAmount: number;
}): Promise<CreateOrderResult> => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  // Start by checking if total amount is correct
  const checkout = await client
    .query<CheckoutQuery, CheckoutQueryVariables>(CheckoutDocument, {
      id: checkoutId,
    })
    .toPromise();

  if (checkout.error) {
    throw checkout.error;
  }

  if (!checkout.data?.checkout) {
    return {
      errors: ["CHECKOUT_NOT_FOUND"],
    };
  }

  if (checkout.data?.checkout?.totalPrice.gross.amount !== totalAmount) {
    return {
      errors: ["TOTAL_AMOUNT_MISMATCH"],
    };
  }

  const { data, error } = await client
    .mutation<OrderCreateMutation, OrderCreateMutationVariables>(OrderCreateDocument, {
      id: checkoutId,
    })
    .toPromise();

  if (error) {
    throw error;
  }

  if (!data?.orderCreateFromCheckout?.order) {
    return {
      errors: data?.orderCreateFromCheckout?.errors.map((e) => e.code) || [
        "COULD_NOT_CREATE_ORDER_FROM_CHECKOUT",
      ],
    };
  }

  if (process.env.DEMO_MODE) {
    return {
      data: {
        ...data.orderCreateFromCheckout.order,
        userEmail: "checkout@example.com",
      },
    };
  }

  return { data: data.orderCreateFromCheckout.order };
};
