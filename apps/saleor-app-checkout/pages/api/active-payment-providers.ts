import { getActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const providersSettings = await getActivePaymentProvidersSettings();

  console.log(providersSettings); // for deployment debug pusposes

  res.status(200).json(providersSettings);
}
export default allowCors(handler);
