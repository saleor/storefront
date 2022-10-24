import * as Sentry from "@sentry/nextjs";
import { allowCors } from "@/saleor-app-checkout/backend/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  Sentry.captureException(new Error("Test error"));
  return res.status(500).json({ ok: false, provider: "test" });
};

export default allowCors(handler);
