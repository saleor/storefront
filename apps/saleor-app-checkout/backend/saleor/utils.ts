import * as jose from "jose";
import crypto from "crypto";

/** Validates Saleor webhook request.
 * Saleor version 3.5+ is required
 */
export async function isValidSaleorRequest({
  saleorApiHost,
  bodyBuffer,
  signature,
}: {
  saleorApiHost: string;
  bodyBuffer: Buffer;
  signature: string;
}): Promise<boolean> {
  // TODO: Use JWS (JSON Web Signature) when implemented in core
  // PR: https://github.com/saleor/saleor/pull/10080

  const JWKS = jose.createRemoteJWKSet(new URL(`https://${saleorApiHost}/.well-known/jwks.json`));

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
