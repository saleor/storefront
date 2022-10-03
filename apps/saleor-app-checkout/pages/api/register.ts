import { createDebug } from './../../utils/debug';
import { apl } from './../../config/saleorApp';
import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { saleorDomainHeader } from "../../constants";

const debug = createDebug("api/register")

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  debug("Received request to register the app");

  const saleorDomain = request.headers[saleorDomainHeader] as string;
  if (!saleorDomain) {
    debug("Request does not contain Saleor domain header.")
    response.status(400).json({ success: false, message: "Missing saleor domain header." });
    return;
  }

  // TODO: Add a util to restrict domains based on env
//   if (getAppDomain() !== saleorDomain) {
//     console.error(`App instalation tried from non-matching Saleor domain.
// Expected ${getAppDomain()} (defined in NEXT_PUBLIC_SALEOR_API_URL).
// Received: ${saleorDomain.toString()}`);

//     response.status(400).json({
//       success: false,
//       message: "Saleor domain doesn't match configured NEXT_PUBLIC_SALEOR_API_URL domain",
//     });
//     return;
//   }

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    debug("Request does not contain auth token.")
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  debug("Saving auth data")
  try{
    await apl.set({domain: saleorDomain, token: authToken})
  }catch(error){
    debug("Error thrown during saving the auth data: %O", error)
    response.status(500).json({ success: false, message: "Unable to save registration data" });
    return;
  }
  debug("Auth data saved. Registration complete")
  response.status(200).json({ success: true });
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withSentry(handler);
