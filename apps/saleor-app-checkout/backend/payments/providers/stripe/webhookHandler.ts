import { StripeWebhookEvents } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeWebhookTypes";
import { getStripeClient } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";
import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { Stripe } from "stripe";
import {
  getSaleorAmountFromInteger,
  getTransactionAmountGetter,
} from "@/saleor-app-checkout/backend/payments/utils";
import { assertUnreachable } from "checkout-common";

/**
 * https://stripe.com/docs/webhooks
 */

export const STRIPE_PAYMENT_PREFIX = "stripe";

export const verifyStripeEventSignature = async ({
  saleorApiUrl,
  body,
  signature,
  secret,
}: {
  saleorApiUrl: string;
  body: string | Buffer;
  signature: string;
  secret: string;
}) => {
  const stripeClient = await getStripeClient(saleorApiUrl);
  return stripeClient.webhooks.constructEvent(body, signature, secret) as StripeWebhookEvents;
};

const getPaymentIntentFromCheckoutSession = async ({
  saleorApiUrl,
  checkoutSession,
}: {
  saleorApiUrl: string;
  checkoutSession: Stripe.Checkout.Session;
}) => {
  if (!checkoutSession.payment_intent) {
    return null;
  }
  if (typeof checkoutSession.payment_intent === "object") {
    return checkoutSession.payment_intent;
  }

  const stripeClient = await getStripeClient(saleorApiUrl);
  return stripeClient.paymentIntents.retrieve(checkoutSession.payment_intent);
};

export const getLatestChargeFromPaymentIntent = (paymentIntent: Stripe.PaymentIntent | null) => {
  // https://stripe.com/docs/api/payment_intents/object#payment_intent_object-charges
  // This list only contains the latest charge
  // even if there were previously multiple unsuccessful charges.
  return paymentIntent?.charges?.data?.[0];
};

export const getPaymentMethodFromPaymentIntent = (paymentIntent: Stripe.PaymentIntent | null) => {
  return getLatestChargeFromPaymentIntent(paymentIntent)?.payment_method_details?.type;
};

export const checkoutSessionToTransactionCreateMutationVariables = async ({
  saleorApiUrl,
  eventType,
  checkoutSession,
}: {
  saleorApiUrl: string;
  eventType:
    | "checkout.session.async_payment_failed"
    | "checkout.session.async_payment_succeeded"
    | "checkout.session.completed"
    | "checkout.session.expired";
  checkoutSession: Stripe.Checkout.Session;
}): Promise<(Omit<TransactionCreateMutationVariables, "id"> & { id?: string }) | null> => {
  const paymentIntent = await getPaymentIntentFromCheckoutSession({
    saleorApiUrl,
    checkoutSession,
  });
  const method = getPaymentMethodFromPaymentIntent(paymentIntent);
  const charge = getLatestChargeFromPaymentIntent(paymentIntent);

  if (
    // Occurs when a payment intent using a delayed payment method fails.
    eventType === "checkout.session.async_payment_failed" ||
    // Occurs when a Checkout Session is expired.
    eventType === "checkout.session.expired"
  ) {
    return {
      id: checkoutSession.metadata?.orderId,
      transaction: {
        status: checkoutSession.status || "unknown",
        reference: checkoutSession.id,
        type: `${STRIPE_PAYMENT_PREFIX}-${method || "(unknown-payment-method)"}`,
        availableActions: [],
      },
      transactionEvent: {
        status: "FAILURE",
        name: eventType,
      },
    };
  }

  if (
    // Occurs when a Checkout Session has been successfully completed.
    eventType === "checkout.session.completed" ||
    // Occurs when a payment intent using a delayed payment method finally succeeds.
    eventType === "checkout.session.async_payment_succeeded"
  ) {
    if (!charge?.currency || !charge?.amount) {
      // @todo ?
      return null;
    }

    const getAmount = getTransactionAmountGetter({
      authorized: undefined,
      charged: getSaleorAmountFromInteger(charge.amount),
      voided: undefined,
      refunded: undefined,
    });

    return {
      id: checkoutSession.metadata?.orderId,
      transaction: {
        status: checkoutSession.status || "unknown",
        reference: checkoutSession.id,
        type: `${STRIPE_PAYMENT_PREFIX}-${method || "(unknown-payment-method)"}`,
        amountAuthorized: undefined,
        amountCharged: {
          amount: getAmount("charged"),
          currency: charge.currency.toUpperCase(),
        },
        availableActions: ["REFUND"],
      },
      transactionEvent: {
        status: "SUCCESS",
        name: eventType,
      },
    };
  }

  return assertUnreachable(eventType);
};

export const stripeWebhookEventToTransactionCreateMutationVariables = ({
  saleorApiUrl,
  event,
}: {
  saleorApiUrl: string;
  event: StripeWebhookEvents;
}) => {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_failed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.expired":
      return checkoutSessionToTransactionCreateMutationVariables({
        saleorApiUrl,
        eventType: event.type,
        checkoutSession: event.data.object,
      });
    default:
      return null;
  }
};
