import { StripeWebhookEvents } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeWebhookTypes";
import { getStripeClient } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";
import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { Stripe } from "stripe";
import {
  getSaleorAmountFromInteger,
  getTransactionAmountGetter,
} from "@/saleor-app-checkout/backend/payments/utils";
import { assertUnreachable } from "checkout-common";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

/**
 * https://stripe.com/docs/webhooks
 */

const debug = createDebug("stripe webhookHandler");

export const STRIPE_PAYMENT_PREFIX = "stripe";

export const verifyStripeEventSignature = async (
  body: string | Buffer,
  signature: string,
  secret: string,
  saleorApiDomain: string
) => {
  debug("verifyStripeEventSignature");
  const stripeClient = await getStripeClient(saleorApiDomain);
  return stripeClient.webhooks.constructEvent(body, signature, secret) as StripeWebhookEvents;
};

const getPaymentIntentFromCheckoutSession = async (
  checkoutSession: Stripe.Checkout.Session,
  domain: string
) => {
  debug("getPaymentIntentFromCheckoutSession");
  if (!checkoutSession.payment_intent) {
    debug("No payment intent");
    return null;
  }
  if (typeof checkoutSession.payment_intent === "object") {
    debug("Type intent - object");
    return checkoutSession.payment_intent;
  }

  const stripeClient = await getStripeClient(domain);
  debug("Retrieve payment intent");
  return stripeClient.paymentIntents.retrieve(checkoutSession.payment_intent);
};

export const getLatestChargeFromPaymentIntent = (paymentIntent: Stripe.PaymentIntent | null) => {
  // https://stripe.com/docs/api/payment_intents/object#payment_intent_object-charges
  // This list only contains the latest charge
  // even if there were previously multiple unsuccessful charges.
  return paymentIntent?.charges.data[0];
};

export const getPaymentMethodFromPaymentIntent = (paymentIntent: Stripe.PaymentIntent | null) => {
  return getLatestChargeFromPaymentIntent(paymentIntent)?.payment_method_details?.type;
};

export const checkoutSessionToTransactionCreateMutationVariables = async (
  eventType:
    | "checkout.session.async_payment_failed"
    | "checkout.session.async_payment_succeeded"
    | "checkout.session.completed"
    | "checkout.session.expired",
  checkoutSession: Stripe.Checkout.Session,
  domain: string
): Promise<(Omit<TransactionCreateMutationVariables, "id"> & { id?: string }) | null> => {
  debug("checkoutSessionToTransactionCreateMutationVariables");
  const paymentIntent = await getPaymentIntentFromCheckoutSession(checkoutSession, domain);
  const method = getPaymentMethodFromPaymentIntent(paymentIntent);
  const charge = getLatestChargeFromPaymentIntent(paymentIntent);

  if (
    // Occurs when a payment intent using a delayed payment method fails.
    eventType === "checkout.session.async_payment_failed" ||
    // Occurs when a Checkout Session is expired.
    eventType === "checkout.session.expired"
  ) {
    debug("failed/expired session");
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
    debug("completed/succeed");
    if (!charge?.currency || !charge?.amount) {
      // @todo ?
      debug("charge is not right");
      return null;
    }

    const getAmount = getTransactionAmountGetter({
      authorized: getSaleorAmountFromInteger(charge.amount),
      voided: undefined,
      refunded: undefined,
      charged: undefined,
    });
    debug("Return success data");
    return {
      id: checkoutSession.metadata?.orderId,
      transaction: {
        status: checkoutSession.status || "unknown",
        reference: checkoutSession.id,
        type: `${STRIPE_PAYMENT_PREFIX}-${method || "(unknown-payment-method)"}`,
        amountAuthorized: {
          amount: getAmount("authorized"),
          currency: charge.currency.toUpperCase(),
        },
        amountCharged: {
          amount: getAmount("authorized"),
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
  debug("assert unreachable");
  return assertUnreachable(eventType);
};

export const stripeWebhookEventToTransactionCreateMutationVariables = (
  event: StripeWebhookEvents,
  domain: string
) => {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_failed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.expired":
      return checkoutSessionToTransactionCreateMutationVariables(
        event.type,
        event.data.object,
        domain
      );
    default:
      return null;
  }
};
