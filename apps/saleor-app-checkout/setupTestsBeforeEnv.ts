import "env-vars";

process.env.SETTINGS_ENCRYPTION_SECRET = "test_salt"; // Change will affect tests fixtures

// Fix for jose missing TextEncoder error
// https://github.com/inrupt/solid-client-authn-js/issues/1676
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
}
