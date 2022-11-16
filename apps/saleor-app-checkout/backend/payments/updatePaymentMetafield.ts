import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  OrderUpdatePaymentMetafieldDocument,
  OrderUpdatePaymentMetafieldMutation,
  OrderUpdatePaymentMetafieldMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const updatePaymentMetafield = async ({
  saleorApiUrl,
  orderId,
  payment,
}: {
  saleorApiUrl: string;
  orderId: OrderUpdatePaymentMetafieldMutationVariables["orderId"];
  payment: OrderPaymentMetafield;
}) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  const { data, error } = await client
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
