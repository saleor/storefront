import { getSaleorDomain } from "@/saleor-app-checkout/backend/utils";
import { transactionActionRequest } from "@/saleor-app-checkout/mocks/fixtures/saleor";
import endpoint, {
  config,
} from "@/saleor-app-checkout/pages/api/webhooks/saleor/transaction-action-request";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Response } from "retes/response";
import { testApiHandler } from "next-test-api-route-handler";
import { PageConfig } from "next";
import { HeadersInit } from "retes/types";
import { withWebhookSignatureVerified } from "@saleor/app-sdk/middleware";
import { getTransactionProcessedEvents } from "@/saleor-app-checkout/backend/payments/getTransactionProcessedEvents";
import { updateTransactionProcessedEvents } from "@/saleor-app-checkout/backend/payments/updateTransactionProcessedEvents";
import { disableConsole } from "@/saleor-app-checkout/test-utils";

const handler: typeof endpoint & { config?: PageConfig } = endpoint;
handler.config = config as PageConfig;

jest.mock("@saleor/app-sdk/middleware", () => ({
  __esModule: true,
  ...jest.requireActual("@saleor/app-sdk/middleware"),
  withWebhookSignatureVerified: jest.fn(
    (_) => (handler) => (req) => handler(req)
  ) as jest.MockedFunction<typeof withWebhookSignatureVerified>,
}));

jest.mock("@/saleor-app-checkout/backend/payments/getTransactionProcessedEvents", () => ({
  __esModule: true,
  getTransactionProcessedEvents: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/saleor-app-checkout/backend/payments/updateTransactionProcessedEvents");

const mockedGetTransactionProcessedEvents = getTransactionProcessedEvents as jest.MockedFunction<
  typeof getTransactionProcessedEvents
>;

const REQUEST_SIGNATURE = "valid_signature";

const getReqHeaders = async (): Promise<HeadersInit> => {
  return {
    "Content-Type": "application/json",
    [SALEOR_DOMAIN_HEADER]: await getSaleorDomain(),
    "saleor-signature": REQUEST_SIGNATURE,
    "saleor-event": "transaction_action_request",
  };
};

describe("Saleor TRANSACTION_ACTION_REQUEST webhook handler", () => {
  it("Rejects requests without transaction data", async () => {
    disableConsole("warn");

    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify(transactionActionRequest.missingData),
          headers: await getReqHeaders(),
        });

        expect(res.status).toBe(Response.BadRequest().status);
        await expect(res.json()).resolves.toStrictEqual({
          success: false,
          message: expect.any(String),
        });
      },
    });
  });

  it("Ignores events that were already processed", async () => {
    mockedGetTransactionProcessedEvents.mockResolvedValueOnce([REQUEST_SIGNATURE]);

    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify(transactionActionRequest.adyenRefund),
          headers: await getReqHeaders(),
        });

        expect(res.status).toBe(200);
        expect(mockedGetTransactionProcessedEvents).toHaveBeenCalled();
        await expect(res.json()).resolves.toStrictEqual({
          success: true,
          message: expect.any(String),
        });
      },
    });

    jest.restoreAllMocks();
  });

  describe("Transaction refund handling", () => {
    // TODO: Fix Polly.js request recording
    it.skip("Refunds transactions in Mollie", async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify(transactionActionRequest.mollieRefund),
            headers: await getReqHeaders(),
          });

          expect(res.status).toBe(200);
          await expect(res.json()).resolves.toStrictEqual({
            success: true,
          });
          expect(updateTransactionProcessedEvents).toHaveBeenCalledWith({
            id: transactionActionRequest.mollieRefund.transaction?.id,
            input: JSON.stringify([REQUEST_SIGNATURE]),
          });
        },
      });
    });

    // TODO: Fix Polly.js request recording
    it.skip("Refunds transactions in Adyen", async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify(transactionActionRequest.adyenRefund),
            headers: await getReqHeaders(),
          });

          expect(res.status).toBe(200);
          await expect(res.json()).resolves.toStrictEqual({
            success: true,
          });
          expect(updateTransactionProcessedEvents).toHaveBeenCalledWith({
            id: transactionActionRequest.adyenRefund.transaction?.id,
            input: JSON.stringify([REQUEST_SIGNATURE]),
          });
        },
      });
    });
  });

  describe("Transaction void handling", () => {
    it.skip("Voids transactions in Mollie", () => {});

    it.skip("Void transactions in Adyen", () => {});
  });
});
