import { encodeBasicAuth } from "@/saleor-app-checkout/backend/payments/providers/adyen/utils";
import { updateTransaction } from "@/saleor-app-checkout/backend/payments/updateTransaction";
import { testingVars } from "@/saleor-app-checkout/mocks/consts";
import {
  ADYEN_ORDER_ID,
  ADYEN_ORIGINAL_REFERENCE,
  ADYEN_TRANSACTION_AMOUNT,
  ADYEN_TRANSACTION_CURRENCY,
  getFirstPaymentCapture,
  getPaymentCapture,
  getPaymentRefund,
  getPaymentRequest,
} from "@/saleor-app-checkout/mocks/fixtures/adyen";
import handler from "@/saleor-app-checkout/pages/api/webhooks/adyen";
import {
  mockRequest,
  setupPollyMiddleware,
  setupRecording,
} from "@/saleor-app-checkout/test-utils";
import { IncomingHttpHeaders } from "http";
import { Response } from "retes/response";
import { getOrderTransactions } from "@/saleor-app-checkout/backend/payments/getOrderTransactions";
import { createTransaction } from "@/saleor-app-checkout/backend/payments/createTransaction";
import { prepareSaleorTransaction } from "@/saleor-app-checkout/mocks/fixtures/saleor";
import { getSaleorAmountFromInteger } from "@/saleor-app-checkout/backend/payments/utils";

jest.mock("@/saleor-app-checkout/backend/payments/updateTransaction");
jest.mock("@/saleor-app-checkout/backend/payments/createTransaction");
jest.mock("@/saleor-app-checkout/backend/payments/getOrderTransactions");

const mockedGetOrderTransactions = getOrderTransactions as jest.MockedFunction<
  typeof getOrderTransactions
>;

const getReqHeaders = (): IncomingHttpHeaders => {
  return {
    authorization: `Basic ${encodeBasicAuth(
      testingVars.adyenWebhookUsername,
      testingVars.adyenWebhookPassword
    )}`,
  };
};

describe("/api/webhooks/adyen", () => {
  const context = setupRecording();

  beforeEach(() => {
    setupPollyMiddleware(context.polly.server);
  });

  it("rejects requests with invalid basic auth", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = {
      authorization: "Basic invalid_auth",
    };
    req.body = getPaymentRequest();

    await handler(req, res);

    expect(res.statusCode).toBe(Response.Unauthorized().status);
  });

  it("rejects requests with no body", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = {};

    await handler(req, res);

    expect(res.statusCode).toBe(Response.BadRequest().status);
  });

  it("rejects request with no hmac", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRequest(null);

    await handler(req, res);

    expect(res.statusCode).toBe(Response.Unauthorized().status);
  });

  it("rejects requests with invalid hmac", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRequest("invalid_hmac");

    await handler(req, res);

    expect(res.statusCode).toBe(Response.Unauthorized().status);
  });

  it("create new payment if it was firstly authorized", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRequest();

    mockedGetOrderTransactions.mockResolvedValueOnce([]);

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe("[accepted]"); // adyen requires this response content
    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        transactionEvent: {
          name: "AUTHORISATION",
          status: "SUCCESS",
          reference: expect.any(String),
        },
        transaction: {
          status: "AUTHORISATION",
          type: "adyen-mc",
          reference: "LD65H2FVNXSKGK82",
          availableActions: ["VOID", "CHARGE"],
          amountAuthorized: {
            amount: getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
        },
      })
    );
  });

  it("create new payment if it was firstly captured", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getFirstPaymentCapture();

    mockedGetOrderTransactions.mockResolvedValueOnce([]);

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe("[accepted]"); // adyen requires this response content
    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        transactionEvent: {
          name: "CAPTURE",
          status: "SUCCESS",
          reference: expect.any(String),
        },
        transaction: {
          status: "CAPTURE",
          type: "adyen-mc",
          reference: "LD65H2FVNXSKGK82",
          availableActions: ["REFUND"],
          amountAuthorized: {
            amount: 0,
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
          amountCharged: {
            amount: getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
        },
      })
    );
  });

  it("updates payment when it was captured", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentCapture();

    mockedGetOrderTransactions.mockResolvedValueOnce([
      prepareSaleorTransaction(
        "authorized",
        getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
        ADYEN_TRANSACTION_CURRENCY,
        { reference: ADYEN_ORIGINAL_REFERENCE, id: ADYEN_ORDER_ID }
      ),
    ]);

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe("[accepted]"); // adyen requires this response content
    expect(updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        transaction: {
          status: "CAPTURE",
          availableActions: ["REFUND"],
          amountAuthorized: {
            amount: 0,
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
          amountCharged: {
            amount: getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
        },
        transactionEvent: {
          name: "CAPTURE",
          status: "SUCCESS",
          reference: expect.any(String),
        },
      })
    );
  });

  it("adds refund to Saleor when status changes to REFUND", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRefund();

    mockedGetOrderTransactions.mockResolvedValueOnce([
      prepareSaleorTransaction(
        "charged",
        getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
        ADYEN_TRANSACTION_CURRENCY,
        { reference: ADYEN_ORIGINAL_REFERENCE, id: ADYEN_ORDER_ID }
      ),
    ]);

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe("[accepted]"); // adyen requires this response content
    expect(updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        transaction: {
          status: "REFUND",
          availableActions: [],
          amountRefunded: {
            amount: getSaleorAmountFromInteger(ADYEN_TRANSACTION_AMOUNT),
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
          amountCharged: {
            amount: 0,
            currency: ADYEN_TRANSACTION_CURRENCY,
          },
        },
        transactionEvent: {
          name: "REFUND",
          status: "SUCCESS",
          reference: expect.any(String),
        },
      })
    );
  });
});
