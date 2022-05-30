import { getClient } from "@/backend/client";
import { envVars, serverEnvVars } from "@/constants";
import {
  OrderCreateDocument,
  OrderCreateMutation,
  OrderCreateMutationVariables,
  OrderFragment,
} from "@/graphql";

import { Errors } from "./types";

export const createOrder = async (
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
  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .mutation<OrderCreateMutation, OrderCreateMutationVariables>(
      OrderCreateDocument,
      { id: checkoutId }
    )
    .toPromise();

  if (error) {
    throw error;
  }

  if (!data?.orderCreateFromCheckout?.order) {
    return {
      errors: data?.orderCreateFromCheckout?.errors.map((e) => e.code!) || [
        "COULD_NOT_CREATE_ORDER_FROM_CHECKOUT",
      ],
    };
  }

  if (data.orderCreateFromCheckout.order.total.gross.amount !== totalAmount) {
    return {
      errors: ["TOTAL_AMOUNT_MISMATCH"],
    };
  }

  return { data: data.orderCreateFromCheckout.order };
};
