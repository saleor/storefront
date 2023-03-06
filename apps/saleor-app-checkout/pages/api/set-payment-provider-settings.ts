import * as Sentry from "@sentry/nextjs";
import {
  getPrivateSettings,
  setPrivateSettings,
} from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { merge } from "lodash-es";
import { createProtectedHandler, NextProtectedApiHandler } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "@/saleor-app-checkout/config/saleorApp";

const handler: NextProtectedApiHandler = async (request, res, ctx) => {
  console.debug("Payment provider settings");
  const {
    authData: { saleorApiUrl },
  } = ctx;

  const data = request.body as string;

  if (!data) {
    return res.status(400).json({
      error: {
        message: "Submitted data is incorrect",
      },
    });
  }

  try {
    const settings = await getPrivateSettings({ saleorApiUrl, obfuscateEncryptedData: false });

    const newSettings = JSON.parse(data);

    const updatedSettings = await setPrivateSettings(saleorApiUrl, {
      ...settings,
      paymentProviders: merge(settings.paymentProviders, newSettings),
    });

    return res.status(200).json({
      data: updatedSettings.paymentProviders,
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return res.status(500).json({ error });
  }
};

export default allowCors(createProtectedHandler(handler, saleorApp.apl, ["HANDLE_PAYMENTS"]));
