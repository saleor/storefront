import { AdyenDropInCreateSessionResponse } from "checkout-common";
import { NextApiHandler } from "next";
import { getAdyenClient } from "../../../../backend/payments/providers/adyen/utils";

const DropInAdyenSessionsHandler: NextApiHandler<AdyenDropInCreateSessionResponse> = async (
  req,
  res
) => {
  const adyenClient = await getAdyenClient();

  // @TODO see if we can reuse `createPaymentLink`
  const session = await adyenClient.checkout.sessions({
    amount: { currency: "EUR", value: 1000 },
    reference: "YOUR_PAYMENT_REFERENCE",
    returnUrl: "https://your-company.com/checkout?shopperOrder=12xy..",
    merchantAccount: "YOUR_MERCHANT_ACCOUNT",
    countryCode: "NL",
  });

  res.status(201).json({ session, clientKey: "@TODO return this" });
};

export default DropInAdyenSessionsHandler;
