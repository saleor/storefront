import { getPublicSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const settings = await getPublicSettings();

  console.log(settings); // for deployment debug pusposes

  res.status(200).json(settings.customizations);
};
export default allowCors(handler);
