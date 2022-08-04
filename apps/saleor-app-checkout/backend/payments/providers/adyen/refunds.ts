import { getClient } from "@/saleor-app-checkout/backend/client";
import {
  TransactionActionPayloadFragment,
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { TransactionRefund } from "@/saleor-app-checkout/types/refunds";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import invariant from "ts-invariant";
import { getActionsAfterRefund } from "../../utils";
import { getAdyenAmountFromSaleor, getAdyenClient } from "./utils";

export async function handleAdyenRefund(
  refund: TransactionRefund,
  transaction: TransactionActionPayloadFragment["transaction"]
) {
  const { id, amount, currency } = refund;
  const { modification, config } = await getAdyenClient();
  const saleorClient = getClient();

  invariant(config.merchantAccount, "Missing merchant account configuration");
  invariant(transaction?.id, "Transaction id is missing");

  // TODO: check payment if refund was already created

  const transactionActions = getActionsAfterRefund(transaction, amount);

  const [refundError, refundResult] = await unpackPromise(
    modification.refunds(id, {
      amount: {
        currency,
        value: getAdyenAmountFromSaleor(amount),
      },
      merchantAccount: config.merchantAccount,
    })
  );

  const { error, data } = await saleorClient
    .mutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(
      TransactionUpdateDocument,
      {
        id: transaction.id,
        transaction: {
          availableActions: transactionActions,
        },
        transactionEvent: {
          status: refundError ? "FAILURE" : "PENDING",
          name: "REQUEST_REFUND",
          reference: refundError?.message ?? refundResult?.pspReference,
        },
      }
    )
    .toPromise();

  const transactionUpdateFailed = error || data?.transactionUpdate?.errors?.length;

  if (transactionUpdateFailed) {
    console.error("Trasaction update failed", error?.message ?? data?.transactionUpdate?.errors);
    throw new Error("Transaction couldn't be updated in Saleor", {
      cause: error,
    });
  }
}
