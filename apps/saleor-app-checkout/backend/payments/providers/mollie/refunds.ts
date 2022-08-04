import { TransactionRefund } from "@/saleor-app-checkout/types/refunds";
import {
  getMollieEventName,
  getMollieClient,
} from "@/saleor-app-checkout/backend/payments/providers/mollie/utils";
import {
  TransactionActionEnum,
  TransactionActionPayloadFragment,
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { PaymentStatus } from "@mollie/api-client";
import {
  getActionsAfterRefund,
  getTransactionAmountGetter,
} from "@/saleor-app-checkout/backend/payments/utils";
import { getClient } from "@/saleor-app-checkout/backend/client";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";

export async function handleMolieRefund(
  refund: TransactionRefund,
  transaction: TransactionActionPayloadFragment["transaction"]
) {
  const mollieClient = await getMollieClient();
  const saleorClient = getClient();

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

  // TODO: Check duplicate webhook invocations
  // based on Saleor-Signature header and metadata saved in transaction

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

  const { error } = await saleorClient
    .mutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(
      TransactionUpdateDocument,
      {
        id: transaction.id,
        transaction: {
          availableActions: transactionActions,
        },
        transactionEvent: {
          status: refundError ? "FAILURE" : "PENDING",
          name: getMollieEventName("refund requested"),
          reference: refundError?.message ?? mollieRefund?.id,
        },
      }
    )
    .toPromise();

  if (error) {
    throw new Error("Transaction couldn't be updated in Saleor", {
      cause: error,
    });
  }
}
