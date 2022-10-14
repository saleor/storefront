import { PayRequestBody } from "checkout-common";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { createOrder } from "./createOrder";
import { getOrderDetails } from "./getOrderDetails";
import { KnownPaymentError } from "./errors";

export const createOrderFromBodyOrId = async (
  saleorApiHost: string,
  body: PayRequestBody
): Promise<OrderFragment> => {
  const provider = body.provider;

  if ("checkoutId" in body) {
    const data = await createOrder({
      saleorApiHost,
      checkoutId: body.checkoutId,
      totalAmount: body.totalAmount,
    });

    if ("errors" in data) {
      throw new KnownPaymentError(provider, data.errors);
    }

    return data.data;
  } else if ("orderId" in body) {
    const data = await getOrderDetails(saleorApiHost, { id: body.orderId });

    if ("errors" in data) {
      throw new KnownPaymentError(provider, data.errors);
    }

    return data.data;
  }

  throw new KnownPaymentError(provider, ["MISSING_CHECKOUT_OR_ORDER_ID"]);
};
