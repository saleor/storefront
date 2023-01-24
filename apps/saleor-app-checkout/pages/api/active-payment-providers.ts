import { getActivePaymentProvidersSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";

const handler: NextApiHandler = async (req, res) => {
  console.debug("Active payment providers called");

  const [saleorApiUrlError, saleorApiUrl] = unpackThrowable(() => getSaleorApiUrlFromRequest(req));

  if (saleorApiUrlError) {
    res.status(400).json({ message: saleorApiUrlError.message });
    return;
  }

  const providersSettings = await getActivePaymentProvidersSettings(saleorApiUrl);

  res.status(200).json(providersSettings);
};
export default allowCors(handler);
