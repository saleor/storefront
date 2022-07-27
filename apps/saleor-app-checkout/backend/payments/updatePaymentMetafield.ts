import { getClient } from "@/saleor-app-checkout/backend/client";
import {
  OrderUpdatePaymentMetafieldDocument,
  OrderUpdatePaymentMetafieldMutation,
  OrderUpdatePaymentMetafieldMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types";

export const updatePaymentMetafield = async (
  orderId: OrderUpdatePaymentMetafieldMutationVariables["orderId"],
  payment: OrderPaymentMetafield
) => {
  const { data, error } = await getClient()
    .mutation<OrderUpdatePaymentMetafieldMutation, OrderUpdatePaymentMetafieldMutationVariables>(
      OrderUpdatePaymentMetafieldDocument,
      {
        orderId,
        data: JSON.stringify(payment),
      }
    )
    .toPromise();

  if (error || data?.updatePrivateMetadata?.errors) {
    return false;
  }

  return true;
};
