import { getClient } from "@/saleor-app-checkout/backend/client";
import { NextApiRequest, NextApiResponse } from "next";

import { saleorDomainHeader } from "../../constants";
import { print } from "graphql/language/printer.js";
import {
  CheckWebhooksDocument,
  CheckWebhooksQuery,
  CheckWebhooksQueryVariables,
  CreateWebhooksDocument,
  CreateWebhooksMutation,
  CreateWebhooksMutationVariables,
  TransactionActionRequestSubscriptionDocument,
} from "@/saleor-app-checkout/graphql";
import { getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { SALEOR_WEBHOOK_TRANSACTION_ENDPOINT } from "./webhooks/saleor/transaction-action-request";
import { getAppDomain, setAuthToken } from "@/saleor-app-checkout/backend/environment";
import urlJoin from "url-join";

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<undefined> => {
  console.debug(request);

  const saleorDomain = request.headers[saleorDomainHeader];
  if (!saleorDomain) {
    response.status(400).json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  if (getAppDomain() !== saleorDomain) {
    console.error(`App instalation tried from non-matching Saleor domain.
Expected ${getAppDomain()} (defined in NEXT_PUBLIC_SALEOR_API_URL).
Received: ${saleorDomain}`);

    response.status(400).json({
      success: false,
      message: "Saleor domain doesn't match configured NEXT_PUBLIC_SALEOR_API_URL domain",
    });
    return;
  }

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  setAuthToken(authToken);
  const client = getClient({ appToken: authToken });

  const { data, error } = await client
    .query<CheckWebhooksQuery, CheckWebhooksQueryVariables>(CheckWebhooksDocument)
    .toPromise();

  if (error) {
    console.error("Error while fetching app's webhooks configuration", error);
    response.status(500).json({
      success: false,
      message: "Error while fetching app's webhooks configuration",
    });
    return;
  }

  const webhooks = data?.app?.webhooks ?? [];
  const webhookUrl = urlJoin(getBaseUrl(request), SALEOR_WEBHOOK_TRANSACTION_ENDPOINT);
  const existingWebhook = webhooks.find((webhook) => webhook.targetUrl === webhookUrl);

  if (webhooks.length === 0 && !existingWebhook) {
    const { data, error } = await client
      .mutation<CreateWebhooksMutation, CreateWebhooksMutationVariables>(CreateWebhooksDocument, {
        targetUrl: webhookUrl,
        query: print(TransactionActionRequestSubscriptionDocument),
      })
      .toPromise();
    if (error || data?.webhookCreate?.errors) {
      console.error("Error while adding app's webhooks", error ?? data?.webhookCreate?.errors);
      response.status(500).json({ success: false, message: "Error while adding app's webhooks" });
      return;
    }
  } else {
    console.log("Webhook creation skipped - webhook already exists");
  }

  response.status(200).json({ success: true });
};

export default handler;
