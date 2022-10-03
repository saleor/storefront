import { getClient } from "@/saleor-app-checkout/backend/client";
import { apl } from "@/saleor-app-checkout/config/saleorApp";
import {
  OrderPaymentDetailsQuery,
  OrderPaymentDetailsQueryVariables,
  OrderPaymentDetailsDocument,
} from "@/saleor-app-checkout/graphql";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

import { Errors } from "./types";

const debug = createDebug("getOrderPaymentDetails");

export const getOrderPaymentDetails = async (
  domain: string,
  id: OrderPaymentDetailsQueryVariables["id"]
) => {
  debug("Called");
  const authData = await apl.get(domain);
  if (!authData) {
    throw new Error("Could not get the query data");
  }
  debug("Fetching data");
  const client = getClient({
    appToken: authData.token,
    apiUrl: `https://${authData.domain}/graphql/`,
  });
  const { data, error } = await client
    .query<OrderPaymentDetailsQuery, OrderPaymentDetailsQueryVariables>(
      OrderPaymentDetailsDocument,
      { id }
    )
    .toPromise();

  if (error) {
    debug("Error: %O", error);
    throw error;
  }

  if (!data?.order) {
    debug(`Order ${id} does not exist`);
    return {
      errors: ["ORDER_DOES_NOT_EXIST"] as Errors,
    };
  }

  debug("Return order data");
  return { data: data.order };
};
