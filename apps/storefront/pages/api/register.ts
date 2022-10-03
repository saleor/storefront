import { NextApiRequest, NextApiResponse } from "next";

import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  if (!saleorDomain) {
    console.error("Missing saleor domain token.");
    response.status(400).json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  if (process.env.NEXT_PUBLIC_SALEOR_API_URL !== saleorDomain) {
    console.error(`App instalation tried from non-matching Saleor domain.
Expected ${
      process.env.NEXT_PUBLIC_SALEOR_API_URL as string
    } (defined in NEXT_PUBLIC_SALEOR_API_URL).
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

  response.status(200).json({ success: true });
};

export default handler;
