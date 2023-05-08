import { NextApiRequest } from "next";
import invariant from "ts-invariant";

export const getSaleorApiUrlFromRequest = (req: NextApiRequest) => {
  const saleorApiUrl = req.query.saleorApiUrl;

  invariant(saleorApiUrl && typeof saleorApiUrl === "string", "saleorApiUrl is required");

  return saleorApiUrl;
};
