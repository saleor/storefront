import { getTokenDataFromRequest } from "@/saleor-app-checkout/backend/auth";
import {
  getPrivateSettings,
  setPrivateSettings,
} from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const tokenData = getTokenDataFromRequest(req);

  const tokenDomain = tokenData?.["iss"];

  if (!tokenDomain) {
    return res.status(500).json({ error: "Token iss is not correct" });
  }

  const apiUrl = `https://${tokenDomain}/graphql/`;

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

    const updatedSettings = await setPrivateSettings(apiUrl, {
      ...settings,
      paymentProviders: {
        ...settings.paymentProviders,
        ...JSON.parse(data),
      },
    });

    return res.status(200).json({
      data: updatedSettings.paymentProviders,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export default allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"]));
