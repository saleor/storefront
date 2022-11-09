import { NextApiRequest, NextApiResponse } from "next";

import { saleorDomainHeader } from "../../constants";
import { getAppDomain, setAuthToken } from "@/saleor-app-checkout/backend/environment";

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  const saleorDomain = request.headers[saleorDomainHeader];
  if (!saleorDomain) {
    console.error("Missing saleor domain token.");
    response.status(400).json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  if (getAppDomain() !== saleorDomain) {
    console.error(`App instalation tried from non-matching Saleor domain.
Expected ${getAppDomain()} (defined in NEXT_PUBLIC_SALEOR_API_URL).
Received: ${saleorDomain.toString()}`);

    response.status(400).json({
      success: false,
      message: "Saleor domain doesn't match configured NEXT_PUBLIC_SALEOR_API_URL domain",
    });
    return;
  }

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    console.error(`Missing auth token`);
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  setAuthToken(authToken);

  response.status(200).json({ success: true });
};

export default handler;
