import { createOrderFromBodyOrId } from "@/saleor-app-checkout/backend/payments/createOrderFromBody";
import { createAdyenCheckoutSession } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { safeJsonParse } from "@/saleor-app-checkout/utils";
import { AdyenDropInCreateSessionResponse, PayRequestBody } from "checkout-common";
import { NextApiHandler } from "next";

const DropInAdyenSessionsHandler: NextApiHandler<
  AdyenDropInCreateSessionResponse | { message: string }
> = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const [error, body] =
    typeof req.body === "string"
      ? safeJsonParse<PayRequestBody>(req.body)
      : [null, req.body as PayRequestBody];

  if (error) {
    console.error(error, req.body);
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }

  try {
    const appUrl = getBaseUrl(req);
    const order = await createOrderFromBodyOrId(body);

    const { session, clientKey } = await createAdyenCheckoutSession({ order, redirectUrl: appUrl });
    return res.status(200).json({ session, clientKey });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: body.provider });
  }
};

export default DropInAdyenSessionsHandler;
