import {
  formatRedirectUrl,
  getIntegerAmountFromSaleor,
} from "@/saleor-app-checkout/backend/payments/utils";

import { getAdyenClient, getLineItems } from "./utils";

import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { CreatePaymentData } from "../../types";
import { PostDropInAdyenPaymentsBody } from "@/saleor-app-checkout/../../packages/checkout-common/dist";
import { PaymentRequest as AdyenPaymentRequest } from "@adyen/api-library/lib/src/typings/checkout/paymentRequest";

export const orderToAdyenRequest = ({
  order,
  returnUrl,
  merchantAccount,
}: {
  order: OrderFragment;
  merchantAccount: string;
  returnUrl: string;
}) => {
  const total = order.total.gross;
  return {
    amount: {
      currency: total.currency,
      value: getIntegerAmountFromSaleor(total.amount),
    },
    reference: order.number || order.id,
    returnUrl,
    merchantAccount,
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
  };
};

export const createAdyenCheckoutPaymentLinks = async ({
  order,
  redirectUrl,
}: CreatePaymentData) => {
  const { config, checkout } = await getAdyenClient();

  return checkout.paymentLinks(
    orderToAdyenRequest({
      order,
      merchantAccount: config.merchantAccount,
      returnUrl: formatRedirectUrl(redirectUrl, order.id),
    })
  );
};

export const createAdyenCheckoutSession = async ({
  currency,
  totalAmount,
  checkoutId,
  redirectUrl,
}: {
  currency: string;
  totalAmount: number;
  checkoutId: string;
  redirectUrl: string;
}) => {
  const { config, checkout } = await getAdyenClient();

  const session = await checkout.sessions({
    merchantAccount: config.merchantAccount,
    amount: {
      currency: currency,
      value: getIntegerAmountFromSaleor(totalAmount),
    },
    returnUrl: formatRedirectUrl(redirectUrl, checkoutId),
    reference: checkoutId,
  });

  return {
    session,
    clientKey: config.clientKey,
  };
};

export const createAdyenCheckoutPayment = async ({
  order,
  redirectUrl,
  adyenStateData,
}: CreatePaymentData & {
  adyenStateData: PostDropInAdyenPaymentsBody["adyenStateData"];
}) => {
  const { config, checkout } = await getAdyenClient();

  const adyenRequest = orderToAdyenRequest({
    merchantAccount: config.merchantAccount,
    order,
    returnUrl: formatRedirectUrl(redirectUrl, order.id),
  });

  const payment = await checkout.payments({
    ...adyenRequest,
    paymentMethod: adyenStateData.paymentMethod,
    browserInfo: (adyenStateData.browserInfo as any) ?? undefined,
    shopperInteraction: AdyenPaymentRequest.ShopperInteractionEnum.Ecommerce,
  });

  return {
    payment,
    clientKey: config.clientKey,
  };
};
