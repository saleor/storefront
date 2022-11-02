import "env-vars";

process.env.SETTINGS_ENCRYPTION_SECRET = "test_salt"; // Change will affect tests fixtures

process.env.APL = "vercel";
process.env.NEXT_PUBLIC_SALEOR_API_URL = "https://master.staging.saleor.cloud/graphql/";
process.env.SALEOR_APP_TOKEN = "TEST";

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
