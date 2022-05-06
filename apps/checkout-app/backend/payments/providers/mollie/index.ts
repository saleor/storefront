import createMollieClient, { OrderStatus } from "@mollie/api-client";

import { OrderFragment, PaymentCreateMutationVariables } from "@/graphql";
import { APP_URL } from "@/constants";

import {
  getDiscountLines,
  getLines,
  getShippingLines,
  parseAmountToString,
} from "./utils";

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export const createMolliePayment = async (
  data: OrderFragment,
  redirectUrl: string
) => {
  const discountLines = getDiscountLines(data.discounts);
  const shippingLines = getShippingLines(data);
  const lines = getLines(data.lines);
  const url = new URL(redirectUrl);
  url.searchParams.set("order", data.token);

  const mollieData = await mollieClient.orders.create({
    orderNumber: data.number!,
    webhookUrl: `${APP_URL}/api/webhooks/mollie`,
    locale: "en_US",
    redirectUrl: url.toString(),
    metadata: {
      orderId: data.id,
    },
    lines: [...discountLines, ...shippingLines, ...lines],
    billingAddress: {
      city: data.billingAddress!.city,
      country: data.billingAddress!.country.code,
      email: data.userEmail!,
      givenName: data.billingAddress!.firstName,
      familyName: data.billingAddress!.lastName,
      postalCode: data.billingAddress!.postalCode,
      streetAndNumber: data.billingAddress!.streetAddress1,
      organizationName: data.billingAddress?.companyName,
    },
    amount: {
      value: parseAmountToString(data.total.gross.amount),
      currency: data.total.gross.currency,
    },
    shippingAddress: data.shippingAddress
      ? {
          city: data.shippingAddress.city,
          country: data.shippingAddress.country.code,
          email: data.userEmail!,
          givenName: data.shippingAddress.firstName,
          familyName: data.shippingAddress.lastName,
          postalCode: data.shippingAddress.postalCode,
          streetAndNumber: data.shippingAddress.streetAddress1,
          organizationName: data.shippingAddress.companyName,
        }
      : undefined,
  });

  return mollieData._links.checkout;
};

export const verifyPayment = async (
  id: string
): Promise<PaymentCreateMutationVariables | undefined> => {
  const { status, amountCaptured, metadata, method, amount } =
    await mollieClient.orders.get(id);

  if (status === OrderStatus.authorized) {
    return {
      id: metadata.orderId,
      payment: {
        status,
        type: `mollie-${method}`,
        amountAuthorized: {
          amount: amount.value,
          currency: amount.currency,
        },
      },
    };
  }

  if (status === OrderStatus.paid) {
    return {
      id: metadata.orderId,
      payment: {
        status,
        type: `mollie-${method}`,
        amountCaptured: amountCaptured && {
          amount: parseFloat(amountCaptured.value),
          currency: amountCaptured.currency,
        },
      },
    };
  }
};
