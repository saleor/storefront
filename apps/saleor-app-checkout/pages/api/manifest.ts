import { print } from "graphql/language/printer.js";
import { appName } from "../../constants";
import { version } from "../../package.json";
import type { Handler } from "retes";
import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import { withBaseURL } from "@saleor/app-sdk/middleware";
import { getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import urlJoin from "url-join";
import { SALEOR_WEBHOOK_TRANSACTION_ENDPOINT } from "./webhooks/saleor/transaction-action-request";
import { TransactionActionRequestSubscriptionDocument } from "@/saleor-app-checkout/graphql";
import invariant from "ts-invariant";

const handler: Handler = (request) => {
  const { baseURL } = request.context;
  invariant(typeof baseURL === "string", `baseURL is not a string`);

  const webhookUrl = urlJoin(getBaseUrl(request), SALEOR_WEBHOOK_TRANSACTION_ENDPOINT);

  const manifest = {
    id: "saleor.checkout.app",
    version: version,
    name: appName,
    about: "Saleor checkout app to quickly configure and customize checkout in your store.",
    permissions: ["HANDLE_PAYMENTS", "HANDLE_CHECKOUTS", "MANAGE_ORDERS", "MANAGE_CHECKOUTS"],
    appUrl: baseURL,
    dataPrivacyUrl: `${baseURL}/data-privacy`,
    supportUrl: `${baseURL}/support`,
    tokenTargetUrl: `${baseURL}/api/register`,
    webhooks: [
      {
        name: "Checkout app payment notifications",
        events: ["TRANSACTION_ACTION_REQUEST"],
        query: print(TransactionActionRequestSubscriptionDocument),
        targetUrl: webhookUrl,
        isActive: true,
      },
    ],
  };

  return Response.OK(manifest);
};

export default toNextHandler([withBaseURL, handler]);
