import { PermissionEnum } from "@/saleor-app-checkout/graphql";
import { NextApiHandler } from "next";
import invariant from "ts-invariant";
import { debugEnvVars, envVars, envVarsNames } from "../constants";
import { isAuthenticated, isAuthorized } from "./auth";

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

export const requireAuthorization =
  (fn: NextApiHandler, requiredPermissions?: PermissionEnum[]): NextApiHandler =>
  async (req, res) => {
    const authenticated = await isAuthenticated(req);

    if (!authenticated) {
      return res.status(401).json({
        error: {
          message: "Unauthenticated",
        },
      });
    }

    const authorized = isAuthorized(req, requiredPermissions);

    if (!authorized) {
      return res.status(403).json({
        error: {
          message: "Unauthorized",
        },
      });
    }

    return fn(req, res);
  };

export const getBaseUrl = (req: { headers: Record<string, string | string[] | undefined> }) => {
  if (debugEnvVars?.appUrl) {
    console.debug("Using DEBUG_APP_URL: ", debugEnvVars.appUrl);
    return debugEnvVars.appUrl;
  }

  const { host = "", "x-forwarded-proto": protocol = "http" } = req.headers;

  invariant(typeof host === "string", "host is not a string");
  invariant(typeof protocol === "string", "protocol is not a string");

  return `${protocol}://${host}`;
};

export const getSaleorDomain = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!envVars.apiUrl) {
      return reject(`Missing ${envVarsNames.apiUrl} environment variable`);
    }
    const url = new URL(envVars.apiUrl);
    return resolve(url.hostname);
  });
};
