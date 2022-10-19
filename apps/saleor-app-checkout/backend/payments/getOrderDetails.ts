import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import * as Apl from "@/saleor-app-checkout/config/apl";
import {
  OrderDetailsQuery,
  OrderDetailsQueryVariables,
  OrderFragment,
  OrderDetailsDocument,
} from "@/saleor-app-checkout/graphql";

import { Errors } from "./types";

type GetOrderDetailsResult =
  | {
      data: OrderFragment;
    }
  | {
      errors: Errors;
    };

export const getOrderDetails = async (
  saleorApiUrl: string,
  { id }: { id: OrderDetailsQueryVariables["id"] }
): Promise<GetOrderDetailsResult> => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  const { data, error } = await client
    .query<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetailsDocument, { id })
    .toPromise();

  if (error) {
    throw error;
  }

  if (!data?.order) {
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

  return { data: data.order };
};
