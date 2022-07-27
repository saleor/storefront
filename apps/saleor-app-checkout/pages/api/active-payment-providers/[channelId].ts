import { getChannelActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { channelId } = req.query;

  console.log(channelId); // for deployment debug pusposes

  if (!channelId) {
    res.status(400).send(`Missing channelId`);
    return;
  }

  const channelProvidersSettings = await getChannelActivePaymentProvidersSettings(
    channelId?.toString()
  );

  console.log(channelProvidersSettings); // for deployment debug pusposes

  res.status(200).json(channelProvidersSettings);
};

export default allowCors(handler);
