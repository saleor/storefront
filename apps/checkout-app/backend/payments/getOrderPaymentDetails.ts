import { getClient } from "@/checkout-app/backend/client";
import { envVars, serverEnvVars } from "@/checkout-app/constants";
import {
  OrderPaymentDetailsQuery,
  OrderPaymentDetailsQueryVariables,
  OrderPaymentDetailsDocument,
} from "@/checkout-app/graphql";

import { Errors } from "./types";

export const getOrderPaymentDetails = async (
  id: OrderPaymentDetailsQueryVariables["id"]
) => {
  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
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
