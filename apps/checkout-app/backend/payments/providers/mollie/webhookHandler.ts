import { OrderStatus } from "@mollie/api-client";

import { TransactionCreateMutationVariables } from "@/graphql";

import { getMollieClient } from "./utils";

export const verifyPayment = async (
  id: string
): Promise<TransactionCreateMutationVariables | undefined> => {
  const mollieClient = await getMollieClient();

  const { status, amountCaptured, metadata, method, amount } =
    await mollieClient.orders.get(id);

  if (status === OrderStatus.authorized) {
    return {
      id: metadata.orderId,
      transaction: {
        status,
        type: `mollie-${method}`,
        amountAuthorized: {
          amount: amount.value,
          currency: amount.currency,
        },
      },
    };
  }

  if (status === OrderStatus.paid) {
    return {
      id: metadata.orderId,
      transaction: {
        status,
        type: `mollie-${method}`,
        amountCharged: amountCaptured && {
          amount: parseFloat(amountCaptured.value),
          currency: amountCaptured.currency,
        },
      },
    };
  }
};
