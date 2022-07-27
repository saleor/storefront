import { ADYEN_PAYMENT_PREFIX } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { MOLLIE_PAYMENT_PREFIX } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { TransactionActionPayloadFragment } from "@/saleor-app-checkout/graphql";
import { TransactionRefund } from "@/saleor-app-checkout/types/refunds";
import { handleMolieRefund } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { handleAdyenRefund } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { toNextHandler } from "retes/adapter";
import {
  withSaleorEventMatch,
  withWebhookSignatureVerified,
} from "@saleor/app-sdk/middleware";
import { Handler, HTTPMethod } from "retes";
import { Response } from "retes/response";
import { withMethod } from "retes/middleware";
import { withSaleorDomainMatch } from "@/saleor-app-checkout/backend/middlewares";

export const SALEOR_WEBHOOK_TRANSACTION_ENDPOINT =
  "api/webhooks/saleor/transaction-action-request";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: Handler<TransactionActionPayloadFragment> = async (req) => {
  const { transaction, action } = req.params;

  if (action.actionType === "REFUND") {
    if (!transaction?.type || !transaction.reference || !action.amount) {
      throw new Error("Missing transaction data");
    }

    const refund: TransactionRefund = {
      id: transaction.reference,
      amount: action.amount,
      currency: transaction.authorizedAmount.currency,
    };

    try {
      if (transaction.type.includes(MOLLIE_PAYMENT_PREFIX)) {
        await handleMolieRefund(refund, transaction);
      }
      if (transaction.type.includes(ADYEN_PAYMENT_PREFIX)) {
        await handleAdyenRefund(refund);
      }
    } catch (e) {
      console.error("Error while creating refund", e);
      return Response.InternalServerError({
        success: false,
        message: "Error while processing refund",
      });
    }
  }

  return Response.OK({ success: true });
};

export default toNextHandler([
  withMethod(HTTPMethod.POST),
  withSaleorDomainMatch,
  withSaleorEventMatch("transaction_action_request"),
  withWebhookSignatureVerified(),
  handler as Handler,
]);
