import { getActivePaymentProvidersByChannel } from "mocks/app";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;
  const activePaymentProvidersForChannel = getActivePaymentProvidersByChannel(
    channelId?.toString()
  );
  res.status(200).json(activePaymentProvidersForChannel);
}
