import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { DummyPayRequestBody } from "@/saleor-app-checkout/../../packages/checkout-common/dist";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { safeJsonParse } from "@/saleor-app-checkout/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [error, body] =
    typeof req.body === "string"
      ? safeJsonParse<DummyPayRequestBody>(req.body)
      : [null, req.body as DummyPayRequestBody];

  if (error) {
    console.error(error, req.body);
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }

  const { orderId, amountCharged } = body;

  const transactionData: TransactionCreateMutationVariables = {
    id: orderId,
    transaction: {
      type: "dummy-payment",
      status: "complete",
      amountCharged,
    },
  };

  await updateOrCreateTransaction(transactionData.id, transactionData);

  res.status(200).send({ ok: true });
}

export default withSentry(allowCors(handler));
