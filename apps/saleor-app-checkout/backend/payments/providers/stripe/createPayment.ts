import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import invariant from "ts-invariant";
import { CreatePaymentData, CreatePaymentResult } from "../../types";
import Stripe from "stripe";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { formatRedirectUrl, getIntegerAmountFromSaleor } from "../../utils";
import { PaymentMethodID } from "@/saleor-app-checkout/../../packages/checkout-common";

export const createStripePayment = async ({
  order,
  redirectUrl,
  appUrl,
  method,
}: CreatePaymentData): Promise<CreatePaymentResult> => {
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings(envVars.apiUrl, false);

  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");

  const stripeClient = new Stripe(stripe.secretKey, { apiVersion: "2022-08-01" });

  const stripeCheckoutCustomer = await stripeClient.customers.create({
    email: order.userEmail ?? undefined,
    name: order.billingAddress?.firstName + " " + order.billingAddress?.lastName,
    address: order.billingAddress
      ? {
          city: order.billingAddress.city,
          country: order.billingAddress.country.code,
          line1: order.billingAddress.streetAddress1,
          line2: order.billingAddress.streetAddress2,
          postal_code: order.billingAddress.postalCode,
          state: order.billingAddress.countryArea,
        }
      : null,
    phone: order.billingAddress?.phone || order.shippingAddress?.phone || undefined,
    shipping: order.shippingAddress
      ? {
          name: order.shippingAddress.firstName + " " + order.shippingAddress.lastName,
          phone: order.shippingAddress.phone ?? undefined,
          address: {
            city: order.shippingAddress.city,
            country: order.shippingAddress.country.code,
            line1: order.shippingAddress.streetAddress1,
            line2: order.shippingAddress.streetAddress2,
            postal_code: order.shippingAddress.postalCode,
            state: order.shippingAddress.countryArea,
          },
        }
      : null,
  });

  const stripePaymentMethod = saleorPaymentMethodIdToStripePaymentMethodId(method);

  const stripeCheckoutSession = await stripeClient.checkout.sessions.create({
    line_items: order.lines.map(saleorLineToStripeLine),

    // @todo
    locale: "en",

    payment_method_types: stripePaymentMethod ? [stripePaymentMethod] : undefined,
    customer: stripeCheckoutCustomer.id,
    mode: "payment",
    cancel_url: formatRedirectUrl(redirectUrl, order.id),
    success_url: formatRedirectUrl(redirectUrl, order.id),
    metadata: {
      orderId: order.id,
    },
  });

  return {
    url: stripeCheckoutSession.url,
    id: stripeCheckoutSession.id,
  };
};

type SaleorLine = OrderFragment["lines"][number];
const saleorLineToStripeLine = (line: SaleorLine): Stripe.Checkout.SessionCreateParams.LineItem => {
  return {
    price_data: {
      currency: line.unitPrice.gross.currency,
      unit_amount: getIntegerAmountFromSaleor(line.unitPrice.gross.amount),
      product_data: {
        name: line.productName + "-" + line.variantName,
        images: line.thumbnail?.url ? [line.thumbnail.url] : [],
      },
    },
    quantity: line.quantity,
  };
};

const saleorPaymentMethodIdToStripePaymentMethodId = (
  paymentMethodId: PaymentMethodID
): Stripe.Checkout.SessionCreateParams.PaymentMethodType | null => {
  switch (paymentMethodId) {
    case "creditCard":
      return "card";
    case "applePay":
      // @todo ?
      return null;
    case "paypal":
      // @todo ?
      return null;
  }
};
