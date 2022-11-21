import * as jose from "jose";
import crypto from "crypto";

/** Validates Saleor webhook request.
 * Saleor version 3.5+ is required
 */
export async function isValidSaleorRequest({
  saleorApiUrl,
  bodyBuffer,
  signature,
}: {
  saleorApiUrl: string;
  bodyBuffer: Buffer;
  signature: string;
}): Promise<boolean> {
  const origin = new URL(saleorApiUrl).origin;
  const JWKS = jose.createRemoteJWKSet(new URL(`${origin}/.well-known/jwks.json`));

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
