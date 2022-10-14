import { getChannelActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { getSaleorApiHostFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";

const handler: NextApiHandler = async (req, res) => {
  const { channelId } = req.query;

  const [saleorApiHostError, saleorApiHost] = unpackThrowable(() =>
    getSaleorApiHostFromRequest(req)
  );

  if (saleorApiHostError) {
    res.status(400).json({ message: saleorApiHostError.message });
    return;
  }

  if (!channelId) {
    res.status(400).json({ message: `Missing channelId` });
    return;
  }

  const channelProvidersSettings = await getChannelActivePaymentProvidersSettings({
    saleorApiHost,
    channelId: channelId.toString(),
  });

  console.log(channelProvidersSettings); // for deployment debug pusposes

  res.status(200).json(channelProvidersSettings);
};

export default allowCors(handler);
