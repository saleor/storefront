import { NextApiHandler } from "next";
import invariant from "ts-invariant";
import { debugEnvVars } from "../constants";

export const allowCors =
  (fn: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return fn(req, res);
  };

export const getBaseUrl = (req: { headers: Record<string, string | string[] | undefined> }) => {
  if (debugEnvVars?.appUrl) {
    console.debug("Using DEBUG_APP_URL: ", debugEnvVars.appUrl);
    return debugEnvVars.appUrl;
  }

  const { host = "", "x-forwarded-proto": forwardedProtocol = "http" } = req.headers;

  const protocol = forwardedProtocol.includes(",") ? "http" : forwardedProtocol; // proxy can have value http,https

  invariant(typeof host === "string", "host is not a string");
  invariant(typeof protocol === "string", "protocol is not a string");

  return `${protocol}://${host}`;
};
