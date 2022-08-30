import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

const handler = async (_req: NextApiRequest, _res: NextApiResponse) => {
  throw new Error("API throw error test");
};

export default withSentry(handler);
