import * as Sentry from "@sentry/nextjs";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { createProtectedHandler, NextProtectedApiHandler } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "@/saleor-app-checkout/config/saleorApp";

const handler: NextProtectedApiHandler = async (request, res, ctx) => {
  console.debug("Payment provider settings called ");

  const {
    authData: { saleorApiUrl },
  } = ctx;

  try {
    const settings = await getPrivateSettings({ saleorApiUrl, obfuscateEncryptedData: true });

    res.status(200).json({
      data: settings.paymentProviders,
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return res.status(500).json({ error });
  }
};

export default allowCors(createProtectedHandler(handler, saleorApp.apl, ["HANDLE_PAYMENTS"]));
