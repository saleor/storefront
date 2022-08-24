import {
  formatRedirectUrl,
  getIntegerAmountFromSaleor,
} from "@/saleor-app-checkout/backend/payments/utils";

import { getAdyenClient, getLineItems } from "./utils";
import invariant from "ts-invariant";

import type { CheckoutAPI } from "@adyen/api-library";

import { CreatePaymentData } from "../../types";

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

export const createAdyenPayment = async (paymentData: CreatePaymentData) => {
  const { config, checkout } = await getAdyenClient();
  invariant(config.merchantAccount, "Missing merchant account configuration");

  const { url, id } = await createPaymentLink(paymentData, checkout, config.merchantAccount);

  return { url, id };
};
