import { withSentry } from "@sentry/nextjs";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { envVars } from "@/saleor-app-checkout/constants";

const handler: NextApiHandler = async (req, res) => {
  // const tokenData = getTokenDataFromRequest(req);
  // const tokenDomain = tokenData?.["iss"];
  // if (!tokenDomain) {
  //   return res.status(500).json({ error: "Token iss is not correct" });
  // }
  // const apiUrl = `https://${tokenDomain}/graphql/`;

  const apiUrl = envVars.apiUrl;

  try {
    const settings = await getPrivateSettings(apiUrl, true);

    res.status(200).json({
      data: settings.paymentProviders,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export default withSentry(allowCors(requireAuthorization(handler, ["HANDLE_PAYMENTS"])));
