import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  OrderPaymentDetailsQuery,
  OrderPaymentDetailsQueryVariables,
  OrderPaymentDetailsDocument,
} from "@/saleor-app-checkout/graphql";
import * as Apl from "@/saleor-app-checkout/config/apl";

import { Errors } from "./types";

export const getOrderPaymentDetails = async (
  saleorApiUrl: string,
  { id }: { id: OrderPaymentDetailsQueryVariables["id"] }
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  const { data, error } = await client
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
