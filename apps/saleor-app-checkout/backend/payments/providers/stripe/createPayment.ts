import { CreatePaymentData, CreatePaymentResult } from "../../types";
import Stripe from "stripe";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { formatRedirectUrl, getIntegerAmountFromSaleor } from "../../utils";
import { PaymentMethodID } from "checkout-common";
import { getStripeClient } from "./stripeClient";

export const createStripePayment = async ({
  order,
  redirectUrl,
  appUrl,
  method,
}: CreatePaymentData): Promise<CreatePaymentResult> => {
  const stripeClient = await getStripeClient();

  const stripeCheckoutCustomer = await createStripeCustomerFromOrder(stripeClient, order);

  const stripePaymentMethod = saleorPaymentMethodIdToStripePaymentMethodId(method);

  const stripeCheckoutSession = await stripeClient.checkout.sessions.create({
    line_items: [
      ...order.lines.map(saleorLineToStripeLine),
      ...order.discounts.map(saleorDiscountToStripeLine),
      saleorOrderShippingToStripeLine(order),
    ],

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
      currency: line.unitPrice.gross.currency.toUpperCase(),
      unit_amount: getIntegerAmountFromSaleor(line.unitPrice.gross.amount),
      product_data: {
        name: line.productName + "-" + line.variantName,
        images: line.thumbnail?.url ? [line.thumbnail.url] : [],
      },
    },
    quantity: line.quantity,
  };
};

type SaleorDiscount = OrderFragment["discounts"][number];
const saleorDiscountToStripeLine = (
  discount: SaleorDiscount
): Stripe.Checkout.SessionCreateParams.LineItem => {
  return {
    price_data: {
      currency: discount.amount.currency.toUpperCase(),
      unit_amount: getIntegerAmountFromSaleor(discount.amount.amount),
      product_data: {
        name: "Discount " + (discount.name || ""),
        images: [],
      },
    },
    quantity: 1,
  };
};

const saleorOrderShippingToStripeLine = (
  order: OrderFragment
): Stripe.Checkout.SessionCreateParams.LineItem => {
  return {
    quantity: 1,
    price_data: {
      currency: order.shippingPrice.gross.currency.toUpperCase(),
      unit_amount: getIntegerAmountFromSaleor(order.shippingPrice.gross.amount),
      product_data: {
        name: "Shipping " + (order.shippingMethodName || ""),
        images: [],
      },
    },
  };
};

const saleorPaymentMethodIdToStripePaymentMethodId = (
  paymentMethodId: PaymentMethodID
): Stripe.Checkout.SessionCreateParams.PaymentMethodType | null => {
  switch (paymentMethodId) {
    case "creditCard":
      return "card";
    case "applePay":
      // @todo https://github.com/saleor/react-storefront/issues/390
      return null;
    case "paypal":
      // @todo https://github.com/saleor/react-storefront/issues/390
      return null;
  }
};

const createStripeCustomerFromOrder = (stripeClient: Stripe, order: OrderFragment) => {
  return stripeClient.customers.create({
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
};
