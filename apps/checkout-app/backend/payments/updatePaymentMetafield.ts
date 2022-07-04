import { getClient } from "@/checkout-app/backend/client";
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
  const { data, error } = await getClient()
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
