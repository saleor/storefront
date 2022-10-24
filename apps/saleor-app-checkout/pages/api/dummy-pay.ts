import { NextApiHandler } from "next";

import { DummyPayRequestBody } from "@/saleor-app-checkout/../../packages/checkout-common/dist";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createParseAndValidateBody } from "@/saleor-app-checkout/utils";
import * as yup from "yup";

const dummyPayBodySchema: yup.ObjectSchema<Omit<DummyPayRequestBody, "checkoutApiUrl">> =
  yup.object({
    orderId: yup.string().required(),
    amountCharged: yup.object({
      amount: yup.number().required(),
      currency: yup.string().required(),
    }),
  });

const parseAndValidateBody = createParseAndValidateBody(dummyPayBodySchema);

const handler: NextApiHandler = async (req, res) => {
  const [error, body] = parseAndValidateBody(req.body);

  if (error) {
    console.error(error, req.body);
    res.status(400).send({ ok: false, error: "Invalid JSON" });
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
};

export default allowCors(handler);
