import * as Sentry from "@sentry/nextjs";
import { TransactionActionPayloadFragment } from "@/saleor-app-checkout/graphql";
import { TransactionReversal } from "@/saleor-app-checkout/types/refunds";
import { handleMolieRefund } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { handleAdyenRefund } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { toNextHandler } from "retes/adapter";
import { withSaleorEventMatch, withWebhookSignatureVerified } from "@saleor/app-sdk/middleware";
import { Handler, HTTPMethod } from "retes";
import { Response } from "retes/response";
import { withMethod } from "retes/middleware";
import { withSaleorDomainMatch } from "@/saleor-app-checkout/backend/middlewares";
import { getTransactionProcessedEvents } from "@/saleor-app-checkout/backend/payments/getTransactionProcessedEvents";
import { updateTransactionProcessedEvents } from "@/saleor-app-checkout/backend/payments/updateTransactionProcessedEvents";
import {
  isAdyenTransaction,
  isMollieTransaction,
} from "@/saleor-app-checkout/backend/payments/utils";

export const SALEOR_WEBHOOK_TRANSACTION_ENDPOINT = "api/webhooks/saleor/transaction-action-request";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: Handler<TransactionActionPayloadFragment> = async (req) => {
  const { transaction, action } = req.params;
  console.log("Start processing Saleor transaction action", action, transaction);

  if (!transaction?.type || !transaction.reference || !action.amount) {
    console.warn("Received webhook call without transaction data", req.params);
    return Response.BadRequest({ success: false, message: "Missing transaction data" });
  }

  const { "saleor-signature": payloadSignature } = req.headers;

  if (!payloadSignature) {
    console.warn("Missing Saleor signature");
    return Response.BadRequest({ success: false, message: "Missing signature" });
  }

  const processedEvents = await getTransactionProcessedEvents({ id: transaction.id });
  const eventProcessed = processedEvents.some((signature) => signature === payloadSignature);

  if (eventProcessed) {
    console.log("Event already processed");
    return Response.OK({ success: true, message: "Event already processed" });
  }

  const transactionReversal: TransactionReversal = {
    id: transaction.reference,
    amount: action.amount,
    currency: transaction.authorizedAmount.currency,
  };

  try {
    if (action.actionType === "REFUND") {
      if (isMollieTransaction(transaction)) {
        await handleMolieRefund(transactionReversal, transaction);
      }
      if (isAdyenTransaction(transaction)) {
        await handleAdyenRefund(transactionReversal, transaction);
      }
    }

    if (action.actionType === "VOID") {
      if (isMollieTransaction(transaction)) {
        // TODO: Handle Mollie void payment
      }
      if (isAdyenTransaction(transaction)) {
        // TODO: Handle Adyen void payment
      }
    }
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error while creating refund", err);
    return Response.InternalServerError({
      success: false,
      message: "Error while processing event",
    });
  }

  await updateTransactionProcessedEvents({
    id: transaction.id,
    input: JSON.stringify([...processedEvents, payloadSignature]),
  });

  console.log("Refund processing complete");
  return Response.OK({ success: true });
};

export default toNextHandler([
  withMethod(HTTPMethod.POST),
  withSaleorDomainMatch,
  withSaleorEventMatch("transaction_action_request"),
  withWebhookSignatureVerified(),
  handler as Handler,
]);
