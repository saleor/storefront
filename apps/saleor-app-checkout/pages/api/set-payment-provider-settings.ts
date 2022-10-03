import { withSentry } from "@sentry/nextjs";
import { getTokenDataFromRequest } from "@/saleor-app-checkout/backend/auth";
import {
  getPrivateSettings,
  setPrivateSettings,
} from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { merge } from "lodash-es";
import { NextApiHandler } from "next";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

const debug = createDebug("api/set-payment-provider-settings")

const handler: NextApiHandler = async (req, res) => {
  debug("Request received")
  const tokenData = getTokenDataFromRequest(req);

  const tokenDomain = tokenData?.["iss"];

  if (!tokenDomain) {
    debug("Error: no token domain")
    return res.status(500).json({ error: "Token iss is not correct" });
  }

  const apiUrl = `https://${tokenDomain}/graphql/`;

  const data = req.body as string;

  if (!data) {
    debug("Error: missing data")
    return res.status(400).json({
      error: {
        message: "Submitted data is incorrect",
      },
    });
  }

  try {
    const settings = await getPrivateSettings(apiUrl, false);

    const newSettings = JSON.parse(data);

    const updatedSettings = await setPrivateSettings(apiUrl, {
      ...settings,
      paymentProviders: merge(settings.paymentProviders, newSettings),
    });

    return res.status(200).json({
      data: updatedSettings.paymentProviders,
    });
  } catch (error) {
    debug("Error during updating the settings: %O", error)
    return res.status(500).json({ error });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withSentry(allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"])));
