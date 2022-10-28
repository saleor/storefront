import type { NextApiRequest, NextApiResponse } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";

import { createClient } from "../../saleor-app/graphql";
import { saleorApp } from "saleor-app/saleor-app";
import { createSettingsManager } from "saleor-app/metadata-manager";

// Interfaces below are shared with the client part to ensure we use the same
// shape of the data for communication. It's completely optional, but makes
// refactoring much easier.
export interface SettingsUpdateApiRequest {
  checkoutUrl: string;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: SettingsUpdateApiRequest;
}

// Helper function to minimize duplication and keep the same response structure.
// Even multiple calls of `get` method will result with only one call to the database.
const sendResponse = async (
  res: NextApiResponse<SettingsApiResponse>,
  statusCode: number,
  settings: SettingsManager
) => {
  res.status(statusCode).json({
    success: statusCode === 200,
    data: {
      checkoutUrl: (await settings.get("checkoutUrl")) || "",
    },
  });
};

// Todo how this is authenticated? We should check token for SET/POST
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsApiResponse>
) {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(saleorDomain);

  console.log(saleorDomain);

  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).json({ success: false });
    return;
  }

  // To make queries to Saleor API we need urql client
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  // Helper located at `src/lib/metadata.ts` returns manager which will be used to
  // get or modify metadata.
  const settings = createSettingsManager(client);

  if (req.method === "GET") {
    await sendResponse(res, 200, settings);
    return;
  } else if (req.method === "POST") {
    const { checkoutUrl } = req.body as SettingsUpdateApiRequest;

    if (checkoutUrl) {
      // You can set metadata one by one, but passing array of the values
      // will spare additional roundtrips to the Saleor API.
      // After mutation is made, internal cache of the manager
      // will be automatically updated
      await settings.set([{ key: "checkoutUrl", value: checkoutUrl }]);
      await sendResponse(res, 200, settings);
      return;
    } else {
      console.log("Missing Settings Values");
      await sendResponse(res, 400, settings);
      return;
    }
  }
  res.status(405).end();
  return;
}
