import { getSettings } from "@/backend/configuration/settings";
import { allowCors } from "@/backend/utils";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const settings = await getSettings();

  res.status(200).json(settings.customizations);
}
export default allowCors(handler);
