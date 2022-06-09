import { getActivePaymentProvidersSettings } from "@/checkout-app/backend/configuration/settings";
import { allowCors } from "@/checkout-app/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const providersSettings = await getActivePaymentProvidersSettings();

  console.log(providersSettings); // for deployment debug pusposes

  res.status(200).json(providersSettings);
}
export default allowCors(handler);
