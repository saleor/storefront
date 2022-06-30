import { getChannelActivePaymentProvidersSettings } from "@/checkout-app/backend/configuration/settings";
import { allowCors } from "@/checkout-app/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;

  console.log(channelId); // for deployment debug pusposes

  const channelProvidersSettings =
    await getChannelActivePaymentProvidersSettings(channelId?.toString());

  console.log(channelProvidersSettings); // for deployment debug pusposes

  res.status(200).json(channelProvidersSettings);
}

export default allowCors(handler);
