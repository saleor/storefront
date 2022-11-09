import { NextApiRequest, NextApiResponse } from "next";
import * as Apl from "@/saleor-app-checkout/config/apl";

import { saleorDomainHeader } from "../../constants";
import { unpackPromise } from "@/saleor-app-checkout/utils/unpackErrors";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  // @todo: Allow restricting only to specific domains

  const domain = request.headers[saleorDomainHeader];
  if (!domain || typeof domain !== "string") {
    console.error(`Missing ${saleorDomainHeader} header.`);
    response.status(400).json({ success: false, message: `Missing ${saleorDomainHeader} header.` });
    return;
  }
  const saleorApiUrl = `https://${domain}/graphql/`;

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    console.error(`Missing auth token`);
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  const [error] = await unpackPromise(Apl.set({ saleorApiUrl, authToken }));

  if (error) {
    console.log("Error thrown during saving the auth data: %O", error);
    response.status(500).json({ success: false, message: "Unable to save registration data" });
    return;
  }

  response.status(200).json({ success: true });
};

export default handler;
