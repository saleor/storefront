import { appName } from "../../constants";
import { version } from "../../package.json";
import { transactionActionRequestWebhook } from "@/saleor-app-checkout/pages/api/webhooks/saleor/transaction-action-request";
import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

const handler = createManifestHandler({
  async manifestFactory(context): Promise<AppManifest> {
    const { appBaseUrl } = context;

    return {
      id: "saleor.checkout.app",
      version: version,
      name: appName,
      about: "Saleor checkout app to quickly configure and customize checkout in your store.",
      permissions: ["HANDLE_PAYMENTS", "HANDLE_CHECKOUTS", "MANAGE_ORDERS", "MANAGE_CHECKOUTS"],
      appUrl: appBaseUrl,
      dataPrivacyUrl: `${appBaseUrl}/data-privacy`,
      supportUrl: `${appBaseUrl}/support`,
      tokenTargetUrl: `${appBaseUrl}/api/register`,
      webhooks: [transactionActionRequestWebhook.getWebhookManifest(appBaseUrl)],
    };
  },
});

export default handler;
