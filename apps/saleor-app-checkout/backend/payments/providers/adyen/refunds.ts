import { TransactionActionPayloadFragment } from "@/saleor-app-checkout/graphql";
import { TransactionReversal } from "@/saleor-app-checkout/types/refunds";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import invariant from "ts-invariant";
import { updateTransaction } from "../../updateTransaction";
import { getActionsAfterRefund, getIntegerAmountFromSaleor } from "../../utils";
import { getAdyenClient } from "./utils";

export async function handleAdyenRefund(
  refund: TransactionReversal,
  transaction: TransactionActionPayloadFragment["transaction"]
) {
  const { id, amount, currency } = refund;
  const { modification, config } = await getAdyenClient();

  invariant(config.merchantAccount, "Missing merchant account configuration");
  invariant(transaction?.id, "Transaction id is missing");

  const transactionActions = getActionsAfterRefund(transaction, amount);

  const [refundError, refundResult] = await unpackPromise(
    modification.refunds(id, {
      amount: {
        currency,
        value: getIntegerAmountFromSaleor(amount),
      },
      merchantAccount: config.merchantAccount,
    })
  );

  const updateSucceeded = await updateTransaction({
    id: transaction.id,
    transaction: {
      availableActions: transactionActions,
    },
    transactionEvent: {
      status: refundError ? "FAILURE" : "PENDING",
      name: "REQUEST_REFUND",
      reference: refundError?.message ?? refundResult?.pspReference,
    },
  });

  if (!updateSucceeded) {
    console.error("Transaction status couldn't be updated in Saleor");
    throw new Error("Transaction couldn't be updated in Saleor");
  }
}
