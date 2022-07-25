import { getActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (_, res) => {
  const providersSettings = await getActivePaymentProvidersSettings();

  console.log(providersSettings); // for deployment debug pusposes

  res.status(200).json(providersSettings);
};
export default allowCors(handler);
