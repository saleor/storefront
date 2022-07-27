import * as jose from "jose";
import crypto from "crypto";
import { envVars } from "@/saleor-app-checkout/constants";

const getSaleorDomain = () => {
  const url = new URL(envVars.apiUrl);
  return url.origin;
};

const JWKS = jose.createRemoteJWKSet(
  new URL(getSaleorDomain() + "/.well-known/jwks.json")
);

/** Validates Saleor webhook request.
 * Saleor version 3.5+ is required
 */
export async function isValidSaleorRequest(
  bodyBuffer: Buffer,
  signature: string
): Promise<boolean> {
  // TODO: Use JWS (JSON Web Signature) when implemented in core
  // PR: https://github.com/saleor/saleor/pull/10080

  let key;
  try {
    // @ts-expect-error using fake JWS to get the key
    key = await JWKS({ alg: "RS256", kid: "1" }, {});
  } catch (e) {
    console.warn("Error while getting Saleor JWK", e);
    return false;
  }

  return crypto.verify(
    "rsa-sha256",
    bodyBuffer,
    // @ts-expect-error mismatch between node types and jose
    key,
    Buffer.from(signature, "hex")
  );
}
