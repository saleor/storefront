import { TransactionReversal } from "@/saleor-app-checkout/types/refunds";
import {
  getMollieEventName,
  getMollieClient,
} from "@/saleor-app-checkout/backend/payments/providers/mollie/utils";
import { TransactionActionPayloadFragment } from "@/saleor-app-checkout/graphql";
import { PaymentStatus } from "@mollie/api-client";
import { getActionsAfterRefund } from "@/saleor-app-checkout/backend/payments/utils";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { updateTransaction } from "../../updateTransaction";

export async function handleMolieRefund(
  refund: TransactionReversal,
  transaction: TransactionActionPayloadFragment["transaction"]
) {
  const mollieClient = await getMollieClient();

  const { id, amount, currency } = refund;
  if (!transaction?.id) {
    throw new Error("Transaction id was not provided");
  }

  const order = await mollieClient.orders.get(id);
  const payments = await order.getPayments();
  const payment = payments.find(
    (payment) => payment.status === PaymentStatus.paid && payment.isRefundable()
  );

  if (!payment) {
    throw new Error("Couldn't find Mollie payment to refund");
  }

  const transactionActions = getActionsAfterRefund(transaction, amount);

  const [refundError, mollieRefund] = await unpackPromise(
    mollieClient.payments_refunds.create({
      paymentId: payment?.id,
      amount: {
        value: String(amount),
        currency,
      },
    })
  );

  const updateSucceeded = await updateTransaction({
    id: transaction.id,
    transaction: {
      availableActions: transactionActions,
    },
    transactionEvent: {
      status: refundError ? "FAILURE" : "PENDING",
      name: getMollieEventName("refund requested"),
      reference: refundError?.message ?? mollieRefund?.id,
    },
  });

  if (!updateSucceeded) {
    throw new Error("Transaction couldn't be updated in Saleor");
  }
}
