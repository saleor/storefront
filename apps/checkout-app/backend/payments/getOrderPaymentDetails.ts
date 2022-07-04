import { getClient } from "@/checkout-app/backend/client";
import {
  OrderPaymentDetailsQuery,
  OrderPaymentDetailsQueryVariables,
  OrderPaymentDetailsDocument,
} from "@/checkout-app/graphql";

import { Errors } from "./types";

export const getOrderPaymentDetails = async (
  id: OrderPaymentDetailsQueryVariables["id"]
) => {
  const { data, error } = await getClient()
    .query<OrderPaymentDetailsQuery, OrderPaymentDetailsQueryVariables>(
      OrderPaymentDetailsDocument,
      { id }
    )
    .toPromise();

  if (error) {
    throw error;
  }

  if (!data?.order) {
    return {
      errors: ["ORDER_DOES_NOT_EXIST"] as Errors,
    };
  }

  return { data: data.order };
};
