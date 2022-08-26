import { getClient } from "@/saleor-app-checkout/backend/client";
import {
  OrderDetailsQuery,
  OrderDetailsQueryVariables,
  OrderFragment,
  OrderDetailsDocument,
} from "@/saleor-app-checkout/graphql";

import { Errors } from "./types";

export const getOrderDetails = async (
  id: OrderDetailsQueryVariables["id"]
): Promise<
  | {
      data: OrderFragment;
    }
  | {
      errors: Errors;
    }
> => {
  const { data, error } = await getClient()
    .query<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetailsDocument, { id })
    .toPromise();

  if (error) {
    throw error;
  }

  if (!data?.order) {
    return {
      errors: ["ORDER_DOES_NOT_EXIST"],
    };
  }

  if (process.env.DEMO_MODE) {
    return {
      data: {
        ...data.order,
        userEmail: "checkout@example.com",
      },
    };
  }

  return { data: data.order };
};
