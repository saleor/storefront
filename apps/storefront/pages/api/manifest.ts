import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

export default createManifestHandler({
  manifestFactory(context: { appBaseUrl: string }): AppManifest {
    return {
      id: "saleor.storefront.app",
      version: "1.0.0", // is there any official versioning?
      name: "Saleor Storefront",
      about: "Example Storefront crafted for Saleor",
      permissions: [],
      appUrl: context.appBaseUrl + "/dashboard",
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      extensions: [],
    };
  },
});
