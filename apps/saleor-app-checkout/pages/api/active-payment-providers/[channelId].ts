import { withSentry } from "@sentry/nextjs";
import { getChannelActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

const debug = createDebug("api/active-payment-providers/[channelId]");

const handler: NextApiHandler = async (req, res) => {
  debug(`Request received`);

  const { channelId } = req.query;

  if (!channelId) {
    res.status(400).send(`Missing channelId`);
    return;
  }

  const domain = req.query.domain;
  debug(`Domain ${domain}`);

  if (!domain) {
    debug("Can't return settings - missing domain");
    res.status(400).json({ error: "Missing domain query" });
    return;
  }

  debug("Fetching provider settings");
  const channelProvidersSettings = await getChannelActivePaymentProvidersSettings(
    channelId?.toString(),
    domain as string
  );
  debug("Return the data");
  res.status(200).json(channelProvidersSettings);
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withSentry(allowCors(handler));
