import { appName } from "../../constants";
import { version } from "../../package.json";
import type { Handler } from "retes";
import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import { withBaseURL } from "@saleor/app-sdk/middleware";

const handler: Handler = (request) => {
  const { baseURL } = request.context;

  const manifest = {
    id: "saleor.checkout.app",
    version: version,
    name: appName,
    about:
      "Saleor checkout app to quickly configure and customize checkout in your store.",
    permissions: [
      "HANDLE_PAYMENTS",
      "HANDLE_CHECKOUTS",
      "MANAGE_ORDERS",
      "MANAGE_CHECKOUTS",
    ],
    userPermissions: [],
    appUrl: baseURL,
    dataPrivacyUrl: `${baseURL}/data-privacy`,
    supportUrl: `${baseURL}/support`,
    tokenTargetUrl: `${baseURL}/api/register`,
  };

  return Response.OK(manifest);
};

export default toNextHandler([withBaseURL, handler]);
