import { appName, envVars } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { version } from "../../package.json";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const manifest = {
    id: "saleor.checkout.app",
    version: version,
    name: appName,
    about:
      "Saleor checkout app to quickly configure and customize checkout in your store.",
    permissions: ["HANDLE_PAYMENTS", "HANDLE_CHECKOUTS", "MANAGE_ORDERS"],
    userPermissions: [],
    appUrl: `${envVars.appUrl}/channels`,
    dataPrivacyUrl: `${envVars.appUrl}/data-privacy`,
    supportUrl: `${envVars.appUrl}/support`,
    tokenTargetUrl: `${envVars.appUrl}/api/register`,
  };
  res.end(JSON.stringify(manifest));
};

export default handler;
