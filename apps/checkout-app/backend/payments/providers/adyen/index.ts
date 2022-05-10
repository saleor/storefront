import { Client, CheckoutAPI, Types } from "@adyen/api-library";

import { OrderFragment, TransactionCreateMutationVariables } from "@/graphql";
import { APP_URL } from "@/constants";
import { formatRedirectUrl } from "@/backend/payments/utils";

import {
  getAdyenAmountFromSaleor,
  getSaleorAmountFromAdyen,
  mapAvailableActions,
  getLineItems,
} from "./utils";

const client = new Client({
  apiKey: process.env.ADYEN_API_KEY!,
  environment: "TEST",
});

const checkout = new CheckoutAPI(client);

export const createAdyenPayment = async (
  data: OrderFragment,
  redirectUrl: string
) => {
  const total = data.total.gross;

  const { url } = await checkout.paymentLinks({
    amount: {
      currency: total.currency,
      value: getAdyenAmountFromSaleor(total.amount),
    },
    reference: data.number || data.id,
    returnUrl: formatRedirectUrl(redirectUrl, data.token),
    merchantAccount: "SaleorECOM",
    countryCode: data.billingAddress?.country.code,
    metadata: {
      orderId: data.id,
    },
    lineItems: getLineItems(data.lines),
    shopperEmail: data.userEmail!,
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

export const verifyPayment = async (
  notification: Types.notification.NotificationRequestItem
): Promise<TransactionCreateMutationVariables | undefined> => {
  const {
    eventCode,
    amount,
    pspReference,
    paymentMethod,
    additionalData,
    operations,
  } = notification;
  const paymentLinkId = additionalData?.paymentLinkId;

  if (!paymentLinkId || !operations) {
    return;
  }

  const { metadata } = await checkout.getPaymentLinks(paymentLinkId);

  if (!metadata?.orderId) {
    return;
  }

  if (
    eventCode ===
    Types.notification.NotificationRequestItem.EventCodeEnum.Authorisation
  ) {
    return {
      id: metadata.orderId,
      transaction: {
        status: eventCode.toString(),
        type: `adyen-${paymentMethod}`,
        amountAuthorized: {
          amount: getSaleorAmountFromAdyen(amount.value!),
          currency: amount.currency!,
        },
        reference: pspReference,
        availableActions: mapAvailableActions(operations),
      },
    };
  }

  if (
    eventCode ===
    Types.notification.NotificationRequestItem.EventCodeEnum.Capture
  ) {
    return {
      id: metadata.orderId,
      transaction: {
        status: eventCode.toString(),
        type: `adyen-${paymentMethod}`,
        amountCaptured: {
          amount: getSaleorAmountFromAdyen(amount.value!),
          currency: amount.currency!,
        },
        reference: pspReference,
        availableActions: mapAvailableActions(operations),
      },
    };
  }
};
