import "env-vars";

process.env.SETTINGS_ENCRYPTION_SECRET = "test_salt"; // Change will affect tests fixtures

process.env.APL = "vercel";
process.env.NEXT_PUBLIC_SALEOR_API_URL = "https://master.staging.saleor.cloud/graphql/";
process.env.SALEOR_APP_TOKEN = "TEST";
process.env.SALEOR_APP_ID = "TEST_ID";
process.env.SALEOR_APP_JWKS = `{"keys": [{"kty": "RSA", "key_ops": ["verify"], "n": "4eBXKg2JYGMMbowzvbQcZ4ntSG1HczDavKuvcA3ONkQiQkKg665zNB7koKoGerLf7NFylJm2hQKFDnbG5mfZVgsxz8TOXyJFbKkMQxJ72RFnmyk6diuBo8Sh4h-EdDnm265KvMshU0NTUknlzfRfPYHvQyGsWV5yEyZUErZXMqete3Qovj9Hlq8ASVgGLgjRDzFT09dwXjvZh3YmtZYvPvEL_mrzG4EWw96G9a52Jv646VFRdTeWUYwicWyPNHcVoJB_7KGPpDubJIr8ZCWlcKtavts6ilaDtIgJ-tuQvlAToqwKJo8wYnc5s7FojDyJGZ5aBbNR25PTRZu3-sx1Gw", "e": "AQAB", "use": "sig", "kid": "1"}]}`;

// Fix for jose missing TextEncoder error
// https://github.com/inrupt/solid-client-authn-js/issues/1676
if (typeof global.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
}
