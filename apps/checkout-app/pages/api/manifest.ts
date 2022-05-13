import { appName, envVars } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { version } from "../../package.json";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const manifest = {
    id: "saleor.checkout.app",
    version: version,
    name: appName,
    permissions: ["HANDLE_PAYMENTS", "HANDLE_CHECKOUTS", "MANAGE_ORDERS"],
    appUrl: `${envVars.appUrl}/channels`,
    configurationUrl: `${envVars.appUrl}/channels`,
    tokenTargetUrl: `${envVars.appUrl}/api/register`,
  };
  res.end(JSON.stringify(manifest));
};

export default handler;
