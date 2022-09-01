import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";

const handler: NextApiHandler = (_req, _res) => {};
export default withSentry(handler);
