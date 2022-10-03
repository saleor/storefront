import { withSentry } from "@sentry/nextjs";
import { getTokenDataFromRequest } from "@/saleor-app-checkout/backend/auth";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

const debug = createDebug("api/payment-provider-settings")

const handler: NextApiHandler = async (req, res) => {
  debug("Request received")
  const tokenData = getTokenDataFromRequest(req);

  const tokenDomain = tokenData?.["iss"];

  if (!tokenDomain) {
    debug("Error: incorrect token")
    return res.status(500).json({ error: "Token iss is not correct" });
  }

  const apiUrl = `https://${tokenDomain}/graphql/`;

  try {
    debug(`Getting private settings for domain ${tokenDomain}`)
    const settings = await getPrivateSettings(apiUrl, true);

    res.status(200).json({
      data: settings.paymentProviders,
    });
  } catch (error) {
    debug(`Could not get provider settings: %O`, error)
    return res.status(500).json({ error });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withSentry(allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"])));
