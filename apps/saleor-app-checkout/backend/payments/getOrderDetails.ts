import { getClient } from "@/saleor-app-checkout/backend/client";
import { getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  OrderDetailsQuery,
  OrderDetailsQueryVariables,
  OrderFragment,
  OrderDetailsDocument,
} from "@/saleor-app-checkout/graphql";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

import { Errors } from "./types";

const debug = createDebug("getOrderDetails")

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
  debug(`Getting data for order ${id}`)
  const authData = await getAuthData()
  const client = await getClient({appToken: authData.token, apiUrl: authData.apiUrl})
  const { data, error } = await client
    .query<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetailsDocument, { id })
    .toPromise();

  if (error) {
    debug("Error: %O", error)
    throw error;
  }

  if (!data?.order) {
    debug("Order does not exist")
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
  debug("Return order data")
  return { data: data.order };
};
