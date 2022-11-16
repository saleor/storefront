import { NextApiHandler } from "next";

import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createParseAndValidateBody } from "@/saleor-app-checkout/utils";
import * as yup from "yup";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";
import { DUMMY_PAYMENT_TYPE } from "@/saleor-app-checkout/backend/payments/providers/dummy/refunds";

const dummyPayBodySchema = yup.object({
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

  const [saleorApiUrlError, saleorApiUrl] = unpackThrowable(() => getSaleorApiUrlFromRequest(req));

  if (saleorApiUrlError) {
    res.status(400).json({ message: saleorApiUrlError.message });
    return;
  }

  const { orderId, amountCharged } = body;

  const transactionData: TransactionCreateMutationVariables = {
    id: orderId,
    transaction: {
      type: DUMMY_PAYMENT_TYPE,
      status: "complete",
      amountCharged,
      availableActions: ["REFUND"],
    },
    transactionEvent: {
      status: "SUCCESS",
      name: "Charged",
    },
  };

  await updateOrCreateTransaction({ saleorApiUrl, orderId: transactionData.id, transactionData });

  res.status(200).send({ ok: true });
};

export default allowCors(handler);
