import { getClient } from "@/checkout-app/backend/client";
import { envVars, serverEnvVars } from "@/checkout-app/constants";
import {
  OrderUpdatePaymentMetafieldDocument,
  OrderUpdatePaymentMetafieldMutation,
  OrderUpdatePaymentMetafieldMutationVariables,
} from "@/checkout-app/graphql";
import { OrderPaymentMetafield } from "@/checkout-app/types";

export const updatePaymentMetafield = async (
  orderId: OrderUpdatePaymentMetafieldMutationVariables["orderId"],
  payment: OrderPaymentMetafield
) => {
  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .mutation<
      OrderUpdatePaymentMetafieldMutation,
      OrderUpdatePaymentMetafieldMutationVariables
    >(OrderUpdatePaymentMetafieldDocument, {
      orderId,
      data: JSON.stringify(payment),
    })
    .toPromise();

  if (error || data?.updatePrivateMetadata?.errors) {
    return false;
  }

  return true;
};
