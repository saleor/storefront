import pkg from "../../package.json";
import type { Handler } from "retes";
import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import { withBaseURL } from "@saleor/app-sdk/middleware";
import invariant from "ts-invariant";
import { AppManifest } from "@saleor/app-sdk/types";

const handler: Handler = (request) => {
  const { baseURL } = request.context;
  invariant(typeof baseURL === "string", `baseURL is not a string`);

  const manifest: AppManifest = {
    id: "saleor.storefront.app",
    version: pkg.version,
    name: "Saleor Storefront",
    about: "Example Storefront crafted for Saleor",
    permissions: [],
    appUrl: baseURL + "/dashboard",
    tokenTargetUrl: `${baseURL}/api/register`,
    extensions: [
      {
        mount: "PRODUCT_DETAILS_MORE_ACTIONS",
        label: "Product preview in Storefront",
        permissions: [],
        url: "/test",
        target: "POPUP",
      },
    ],
  };

  return Response.OK(manifest);
};

export default toNextHandler([withBaseURL, handler]);
