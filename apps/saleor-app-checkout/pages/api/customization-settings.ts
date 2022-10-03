import { withSentry } from "@sentry/nextjs";
import { getPublicSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

const debug = createDebug("api/customization-settings")

const handler: NextApiHandler = async (req, res) => {
  const domain = req.query.domain
  debug(`Request received for domain ${domain}`);

  if(!domain){
    debug("Can't return settings - missing domain")
    res.status(400).json({error: "Missing domain query"})
    return;
  }
  const settings = await getPublicSettings(domain as string);
  res.status(200).json(settings.customizations);
};

export const config = {
  api: {
    externalResolver: true,
  },
};
export default withSentry(allowCors(handler));
