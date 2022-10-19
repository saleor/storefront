import { PermissionEnum } from "@/saleor-app-checkout/graphql";
import { decode, JwtPayload, verify } from "jsonwebtoken";
import JwksClient from "jwks-rsa";
import { NextApiRequest } from "next";
import invariant from "ts-invariant";

export class JwtVerifier {
  private static instance: JwtVerifier;
  private static domain: string;

  public jwksClient: JwksClient.JwksClient;

  private constructor(domain: string) {
    // By default, signing key verification results are cached by the client.
    this.jwksClient = JwksClient({
      jwksUri: `https://${domain}/.well-known/jwks.json`,
    });
  }

  public static getInstance(domain: string): JwtVerifier {
    if (!JwtVerifier.instance || JwtVerifier.domain !== domain) {
      JwtVerifier.instance = new JwtVerifier(domain);
      JwtVerifier.domain = domain;
    }

    return JwtVerifier.instance;
  }

  public async verify(token: string): Promise<boolean> {
    const key = await this.jwksClient.getSigningKey();
    const publicKey = key.getPublicKey();

    try {
      verify(token, publicKey);
      return true;
    } catch (err) {
      return false;
    }
  }
}

const getTokenFromRequest = (req: NextApiRequest) => {
  const auth = req.headers.authorization?.split(" ") || [];
  const token = auth?.length > 1 ? auth?.[1] : undefined;

  return token;
};

const getTokenData = (token?: string) => {
  if (!token) {
    return undefined;
  }

  const tokenData = decode(token);

  if (typeof tokenData === "string" || !tokenData) {
    return undefined;
  }

  return tokenData;
};

export const getTokenDataFromRequest = (req: NextApiRequest) => {
  const token = getTokenFromRequest(req);

  const tokenData = getTokenData(token);

  return tokenData;
};

export const getSaleorApiUrlFromRequest = (req: NextApiRequest) => {
  const saleorApiUrl = req.query.saleorApiUrl;

  invariant(saleorApiUrl && typeof saleorApiUrl === "string", "saleorApiUrl is required");

  return saleorApiUrl;
};

export const isAuthenticated = async (req: NextApiRequest) => {
  const token = getTokenFromRequest(req);
  const tokenData = getTokenData(token);
  const saleorApiUrl = getSaleorApiUrlFromRequest(req);

  // @todo
  // if (!token || !tokenData?.["iss"]) {
  //   return false;
  // }

  if (!token || !tokenData) {
    return false;
  }

  const domain = new URL(saleorApiUrl).hostname;
  const jwtVerifier = JwtVerifier.getInstance(domain);

  return jwtVerifier.verify(token);
};

export const hasPermissionsInToken = (
  tokenData?: JwtPayload,
  permissionsToCheckAgainst?: PermissionEnum[]
) => {
  if (!permissionsToCheckAgainst?.length) {
    return true;
  }

  const userPermissions = tokenData?.["user_permissions"] as PermissionEnum[] | undefined;

  if (!userPermissions?.length) {
    return false;
  }

  return permissionsToCheckAgainst.every((permission) => userPermissions.includes(permission));
};

export const isAuthorized = (req: NextApiRequest, requiredPermissions?: PermissionEnum[]) => {
  const tokenData = getTokenDataFromRequest(req);

  if (!tokenData?.["is_staff"]) {
    return false;
  }

  const withPermissions = hasPermissionsInToken(tokenData, requiredPermissions);

  if (!withPermissions) {
    return false;
  }

  return true;
};
