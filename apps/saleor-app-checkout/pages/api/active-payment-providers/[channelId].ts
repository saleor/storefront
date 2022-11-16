import { getChannelActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";

const handler: NextApiHandler = async (req, res) => {
  const { channelId } = req.query;

  const [saleorApiUrlError, saleorApiUrl] = unpackThrowable(() => getSaleorApiUrlFromRequest(req));

  if (saleorApiUrlError) {
    res.status(400).json({ message: saleorApiUrlError.message });
    return;
  }

  if (!channelId) {
    res.status(400).json({ message: `Missing channelId` });
    return;
  }

  const channelProvidersSettings = await getChannelActivePaymentProvidersSettings({
    saleorApiUrl,
    channelId: channelId.toString(),
  });

  console.log(channelProvidersSettings); // for deployment debug pusposes

  res.status(200).json(channelProvidersSettings);
};

export default allowCors(handler);
