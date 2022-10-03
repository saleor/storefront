import { apl, getAuthData } from '@/saleor-app-checkout/config/saleorApp';
import { getClient } from "@/saleor-app-checkout/backend/client";
import {
  CheckoutDocument,
  CheckoutQuery,
  CheckoutQueryVariables,
  OrderCreateDocument,
  OrderCreateMutation,
  OrderCreateMutationVariables,
  OrderFragment,
} from "@/saleor-app-checkout/graphql";

import { Errors } from "./types";
import { createDebug } from '@/saleor-app-checkout/utils/debug';

const debug = createDebug("createOrder")

export const createOrder = async (
  saleorApiDomain: string,
  checkoutId: string,
  totalAmount: number
): Promise<
  | {
      data: OrderFragment;
    }
  | {
      errors: Errors;
    }
> => {
  debug(`Creating order from checkout ${checkoutId} (${saleorApiDomain})`)
  // Start by checking if total amount is correct
  const authData = await apl.get(saleorApiDomain)
  if(!authData){
    throw new Error("Could not get auth data")
  }
  const client = await getClient({appToken: authData.token, apiUrl: `https://${authData.domain}/graphql/`})
  const checkout = await client
    .query<CheckoutQuery, CheckoutQueryVariables>(CheckoutDocument, {
      id: checkoutId,
    })
    .toPromise();

  if (checkout.error) {
    debug("Could not fetch checkout details. Error: %O", checkout.error)
    throw checkout.error;
  }

  if (!checkout.data?.checkout) {
    debug("Error: No checkout found")
    return {
      errors: ["CHECKOUT_NOT_FOUND"],
    };
  }

  if (checkout.data?.checkout?.totalPrice.gross.amount !== totalAmount) {
    debug("Error: total amount mismatch")
    return {
      errors: ["TOTAL_AMOUNT_MISMATCH"],
    };
  }

  debug("Creating order")
  const { data, error } = await client
    .mutation<OrderCreateMutation, OrderCreateMutationVariables>(OrderCreateDocument, {
      id: checkoutId,
    })
    .toPromise();

  if (error) {
    debug("Error during order creation: %O", error)
    throw error;
  }

  if (!data?.orderCreateFromCheckout?.order) {
    debug("Error during order creation: %O", data?.orderCreateFromCheckout?.errors)
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
  debug("Order created")
  return { data: data.orderCreateFromCheckout.order };
};
