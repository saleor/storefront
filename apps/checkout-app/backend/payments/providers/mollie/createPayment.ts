import { envVars } from "@/constants";
import { OrderFragment } from "@/graphql";
import { formatRedirectUrl } from "@/backend/payments/utils";

import {
  getDiscountLines,
  getShippingLines,
  getLines,
  parseAmountToString,
  getMollieClient,
} from "./utils";

export const createMolliePayment = async (
  data: OrderFragment,
  redirectUrl: string
) => {
  const discountLines = getDiscountLines(data.discounts);
  const shippingLines = getShippingLines(data);
  const lines = getLines(data.lines);
  const mollieClient = await getMollieClient();

  const mollieData = await mollieClient.orders.create({
    orderNumber: data.number!,
    webhookUrl: `${envVars.appUrl}/api/webhooks/mollie`,
    locale: "en_US",
    redirectUrl: formatRedirectUrl(redirectUrl, data.id),
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
