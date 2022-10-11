import { withSentry } from "@sentry/nextjs";
import {
  getPrivateSettings,
  setPrivateSettings,
} from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { merge } from "lodash-es";
import { NextApiHandler } from "next";
import { envVars } from "@/saleor-app-checkout/constants";

const handler: NextApiHandler = async (req, res) => {
  // const tokenData = getTokenDataFromRequest(req);
  // const tokenDomain = tokenData?.["iss"];
  // if (!tokenDomain) {
  //   return res.status(500).json({ error: "Token iss is not correct" });
  // }

  const apiUrl = envVars.apiUrl;

  const data = req.body as string;

  if (!data) {
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
    return res.status(500).json({ error });
  }
};
export default withSentry(allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"])));
