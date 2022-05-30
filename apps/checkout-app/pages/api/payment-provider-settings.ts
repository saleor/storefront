import { getTokenDataFromRequest } from "@/backend/auth";
import { getPrivateSettings } from "@/backend/configuration/settings";
import { allowCors, requireAuthorization } from "@/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tokenData = getTokenDataFromRequest(req);

  const tokenDomain = tokenData?.["iss"];

  if (!tokenDomain) {
    return res.status(500).json({ error: "Token iss is not correct" });
  }

  const apiUrl = `https://${tokenDomain}/graphql/`;

  try {
    const settings = await getPrivateSettings(apiUrl, true);

    res.status(200).json({
      data: settings.paymentProviders,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
export default allowCors(requireAuthorization(handler));
