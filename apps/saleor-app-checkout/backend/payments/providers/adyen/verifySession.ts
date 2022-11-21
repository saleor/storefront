import { CheckoutAPI, Client, Types as AdyenTypes } from "@adyen/api-library";

import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { ReuseExistingVendorSessionFn } from "../../types";

export const verifyAdyenSession = async (saleorApiUrl: string, session: string) => {
  const {
    paymentProviders: { adyen },
  } = await getPrivateSettings({ saleorApiUrl, obfuscateEncryptedData: false });

  if (!adyen.apiKey) {
    throw "API key not defined";
  }

  // TODO: Remove hardcoded environment value
  // https://app.clickup.com/t/2549495/SALEOR-7263
  const client = new Client({
    apiKey: adyen.apiKey,
    environment: "TEST",
  });

  const checkout = new CheckoutAPI(client);

  const { status, url } = await checkout.getPaymentLinks(session);

  return { status, url };
};

export const reuseExistingAdyenSession: ReuseExistingVendorSessionFn = async (
  saleorApiUrl,
  { payment, orderId }
) => {
  const session = await verifyAdyenSession(saleorApiUrl, payment.session);
  const StatusEnum = AdyenTypes.checkout.PaymentLinkResponse.StatusEnum;

  if (session.status === StatusEnum.Active) {
    return {
      ok: true,
      provider: payment.provider,
      orderId,
      data: {
        paymentUrl: session.url,
      },
    };
  } else if (
    // Session was successfully completed but Saleor has not yet registered the payment
    [StatusEnum.Completed, StatusEnum.PaymentPending].includes(session.status)
  ) {
    return {
      ok: false,
      provider: payment.provider,
      orderId,
      errors: ["ALREADY_PAID"],
    };
  } else {
    return;
  }
};
