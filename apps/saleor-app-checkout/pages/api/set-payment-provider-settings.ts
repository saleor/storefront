import * as Sentry from "@sentry/nextjs";
import {
  getPrivateSettings,
  setPrivateSettings,
} from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { merge } from "lodash-es";
import { NextApiHandler } from "next";
import { getSaleorApiHostFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";

const handler: NextApiHandler = async (req, res) => {
  // const tokenData = getTokenDataFromRequest(req);
  // const tokenDomain = tokenData?.["iss"];
  // if (!tokenDomain) {
  //   return res.status(500).json({ error: "Token iss is not correct" });
  // }

  const [saleorApiHostError, saleorApiHost] = unpackThrowable(() =>
    getSaleorApiHostFromRequest(req)
  );

  if (saleorApiHostError) {
    res.status(400).json({ message: saleorApiHostError.message });
    return;
  }

  const data = req.body as string;

  if (!data) {
    return res.status(400).json({
      error: {
        message: "Submitted data is incorrect",
      },
    });
  }

  try {
    const settings = await getPrivateSettings({ saleorApiHost, obfuscateEncryptedData: false });

    const newSettings = JSON.parse(data);

    const updatedSettings = await setPrivateSettings(saleorApiHost, {
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
export default allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"]));
