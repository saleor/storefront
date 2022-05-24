import { decode, verify } from "jsonwebtoken";
import JwksClient from "jwks-rsa";
import { NextApiRequest } from "next";

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

export const isAuthenticated = async (req: NextApiRequest) => {
  const token = getTokenFromRequest(req);

  const tokenData = getTokenData(token);

  if (!token || !tokenData?.["iss"]) {
    return false;
  }

  const jwtVerifier = JwtVerifier.getInstance(tokenData["iss"]);

  return await jwtVerifier.verify(token);
};

export const isAuthorized = async (req: NextApiRequest) => {
  const tokenData = getTokenDataFromRequest(req);

  if (!tokenData?.["is_staff"]) {
    return false;
  }
  return true;
};
