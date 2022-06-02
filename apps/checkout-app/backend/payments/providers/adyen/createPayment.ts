import { CheckoutAPI, Client } from "@adyen/api-library";

import { getPrivateSettings } from "@/backend/configuration/settings";
import { envVars } from "@/constants";
import { OrderFragment } from "@/graphql";
import { formatRedirectUrl } from "@/backend/payments/utils";

import { getAdyenAmountFromSaleor, getLineItems } from "./utils";

export const createAdyenPayment = async (
  data: OrderFragment,
  redirectUrl: string
) => {
  const {
    paymentProviders: { adyen },
  } = await getPrivateSettings(envVars.apiUrl, false);

  if (!adyen.apiKey) {
    throw "API key not defined";
  }

  if (!adyen.merchantAccount) {
    throw "Merchant account not defined";
  }

  const client = new Client({
    apiKey: adyen.apiKey,
    environment: "TEST",
  });

  const checkout = new CheckoutAPI(client);

  const total = data.total.gross;

  const { url } = await checkout.paymentLinks({
    amount: {
      currency: total.currency,
      value: getAdyenAmountFromSaleor(total.amount),
    },
    reference: data.number || data.id,
    returnUrl: formatRedirectUrl(redirectUrl, data.id),
    merchantAccount: adyen.merchantAccount,
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
    telephoneNumber:
      data.shippingAddress?.phone || data.billingAddress?.phone || undefined,
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

  return url;
};
