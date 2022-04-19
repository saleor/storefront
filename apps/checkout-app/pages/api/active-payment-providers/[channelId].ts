import { getChannelActivePaymentProvidersSettings } from "@/backend/configuration/settings";
import { allowCors } from "@/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;

  console.log(channelId);

  const channelProvidersSettings =
    await getChannelActivePaymentProvidersSettings(channelId?.toString());

  console.log(channelProvidersSettings);

  res.status(200).json(channelProvidersSettings);
}
export default allowCors(handler);
