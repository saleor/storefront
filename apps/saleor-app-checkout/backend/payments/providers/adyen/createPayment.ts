import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { formatRedirectUrl } from "@/saleor-app-checkout/backend/payments/utils";

import { getAdyenAmountFromSaleor, getAdyenClient, getLineItems } from "./utils";
import invariant from "ts-invariant";

export const createAdyenPayment = async (data: OrderFragment, redirectUrl: string) => {
  const { config, checkout } = await getAdyenClient();
  invariant(config.merchantAccount, "Missing merchant account configuration");

  const total = data.total.gross;

  const { url, id } = await checkout.paymentLinks({
    amount: {
      currency: total.currency,
      value: getAdyenAmountFromSaleor(total.amount),
    },
    reference: data.number || data.id,
    returnUrl: formatRedirectUrl(redirectUrl, data.id),
    merchantAccount: config.merchantAccount,
    countryCode: data.billingAddress?.country.code,
    metadata: {
      orderId: data.id,
    },
    lineItems: getLineItems(data.lines),
    shopperEmail: data.userEmail!,
    shopperName: data.billingAddress
      ? {
          firstName: data.billingAddress.firstName,
          lastName: data.billingAddress.lastName,
        }
      : undefined,
    shopperLocale: "EN", //TODO: get from checkout and pass here
    telephoneNumber: data.shippingAddress?.phone || data.billingAddress?.phone || undefined,
    billingAddress: data.billingAddress
      ? {
          city: data.billingAddress.city,
          country: data.billingAddress.country.code,
          street: data.billingAddress.streetAddress1,
          houseNumberOrName: data.billingAddress.streetAddress2,
          postalCode: data.billingAddress.postalCode,
          stateOrProvince: data.billingAddress.countryArea,
        }
      : undefined,
    deliveryAddress: data.shippingAddress
      ? {
          city: data.shippingAddress.city,
          country: data.shippingAddress.country.code,
          street: data.shippingAddress.streetAddress1,
          houseNumberOrName: data.shippingAddress.streetAddress2,
          postalCode: data.shippingAddress.postalCode,
          stateOrProvince: data.shippingAddress.countryArea,
        }
      : undefined,
  });

  return { url, id };
};
