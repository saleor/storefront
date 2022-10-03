import { getClient } from "@/saleor-app-checkout/backend/client";
import { apl, getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  OrderUpdatePaymentMetafieldDocument,
  OrderUpdatePaymentMetafieldMutation,
  OrderUpdatePaymentMetafieldMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types";

export const updatePaymentMetafield = async (
  domain: string,
  orderId: OrderUpdatePaymentMetafieldMutationVariables["orderId"],
  payment: OrderPaymentMetafield
) => {
  const authData = await apl.get(domain)
  if(!authData){
    throw new Error("Could not get the auth data")
  }
  const client = await getClient({appToken: authData.token, apiUrl: `https://${authData.domain}/graphql/`})
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
