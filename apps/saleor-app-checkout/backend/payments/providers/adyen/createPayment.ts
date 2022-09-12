import {
  formatRedirectUrl,
  getIntegerAmountFromSaleor,
} from "@/saleor-app-checkout/backend/payments/utils";

import { getAdyenClient, getLineItems } from "./utils";
import invariant from "ts-invariant";

import { CreatePaymentData } from "../../types";
import { OrderFragment } from "@/saleor-app-checkout/graphql";

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

type CreateAdyenCheckoutArg = Pick<CreatePaymentData, "order" | "redirectUrl">;

export const createAdyenCheckoutPaymentLinks = async ({
  order,
  redirectUrl,
}: CreateAdyenCheckoutArg) => {
  const { config, checkout } = await getAdyenClient();
  invariant(config.merchantAccount, "Missing merchant account configuration");

  return checkout.paymentLinks(
    orderToAdyenRequest({
      order,
      merchantAccount: config.merchantAccount,
      returnUrl: formatRedirectUrl(redirectUrl, order.id),
    })
  );
};

export const createAdyenCheckoutSession = async ({
  order,
  redirectUrl,
}: CreateAdyenCheckoutArg) => {
  const { config, checkout } = await getAdyenClient();
  invariant(config.merchantAccount, "Missing merchant account configuration");

  console.log({ "config.merchantAccount": config.merchantAccount });

  const session = await checkout.sessions(
    orderToAdyenRequest({
      order,
      merchantAccount: config.merchantAccount,
      returnUrl: formatRedirectUrl(redirectUrl, order.id),
    })
  );

  return {
    session,
    clientKey: config.clientKey,
  };
};
