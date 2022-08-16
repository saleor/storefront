import { CheckoutAPI, Client } from "@adyen/api-library";

import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import {
  formatRedirectUrl,
  getIntegerAmountFromSaleor,
} from "@/saleor-app-checkout/backend/payments/utils";

import { getLineItems } from "./utils";
import { CreatePaymentData } from "../../types";
import invariant from "ts-invariant";

export const createAdyenPayment = async (paymentData: CreatePaymentData) => {
  const {
    paymentProviders: { adyen },
  } = await getPrivateSettings(envVars.apiUrl, false);

  invariant(adyen.apiKey, "API key not defined");
  invariant(adyen.merchantAccount, "Merchant account not defined");

  const client = new Client({
    apiKey: adyen.apiKey,
    environment: "TEST",
  });

  const checkout = new CheckoutAPI(client);

  const { url, id } = await createPaymentLink(paymentData, checkout, adyen.merchantAccount);

  return { url, id };
};
const createPaymentLink = (
  { order, redirectUrl }: CreatePaymentData,
  checkout: CheckoutAPI,
  merchantAccount: string
) => {
  const total = order.total.gross;

  return checkout.paymentLinks({
    amount: {
      currency: total.currency,
      value: getIntegerAmountFromSaleor(total.amount),
    },
    reference: order.number || order.id,
    returnUrl: formatRedirectUrl(redirectUrl, order.id),
    merchantAccount: merchantAccount,
    countryCode: order.billingAddress?.country.code,
    metadata: {
      orderId: order.id,
    },
    lineItems: getLineItems(order.lines),
    shopperEmail: order.userEmail!,
    shopperName: order.billingAddress
      ? {
          firstName: order.billingAddress.firstName,
          lastName: order.billingAddress.lastName,
        }
      : undefined,
    shopperLocale: "EN",
    telephoneNumber: order.shippingAddress?.phone || order.billingAddress?.phone || undefined,
    billingAddress: order.billingAddress
      ? {
          city: order.billingAddress.city,
          country: order.billingAddress.country.code,
          street: order.billingAddress.streetAddress1,
          houseNumberOrName: order.billingAddress.streetAddress2,
          postalCode: order.billingAddress.postalCode,
          stateOrProvince: order.billingAddress.countryArea,
        }
      : undefined,
    deliveryAddress: order.shippingAddress
      ? {
          city: order.shippingAddress.city,
          country: order.shippingAddress.country.code,
          street: order.shippingAddress.streetAddress1,
          houseNumberOrName: order.shippingAddress.streetAddress2,
          postalCode: order.shippingAddress.postalCode,
          stateOrProvince: order.shippingAddress.countryArea,
        }
      : undefined,
  });
};
