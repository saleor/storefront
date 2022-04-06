import { APP_NAME, APP_URL } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { version } from "../../package.json";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const manifest = {
    id: "saleor.checkout.app",
    version: version,
    name: APP_NAME,
    permissions: ["MANAGE_APPS"],
    appUrl: `${APP_URL}/channels`,
    configurationUrl: `${APP_URL}/channels`,
    tokenTargetUrl: `${APP_URL}/api/register`,
  };
  res.end(JSON.stringify(manifest));
};

export default handler;
