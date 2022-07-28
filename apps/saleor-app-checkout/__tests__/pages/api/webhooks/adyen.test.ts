import { encodeBasicAuth } from "@/saleor-app-checkout/backend/payments/providers/adyen/utils";
import { testingVars } from "@/saleor-app-checkout/mocks/consts";
import {
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

  it("updates payment when it was authorized", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRequest();

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    // TODO: Check that transaction event "AUTHORIZATION" was created in Saleor + amounts
  });

  it("updates payment when it was captured", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentCapture();

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    // TODO: Check that transaction event "CAPTURE" was created in Saleor + amounts
  });

  it("adds refund to Saleor when status changes to REFUND", async () => {
    const { req, res } = mockRequest("POST");

    req.headers = getReqHeaders();
    req.body = getPaymentRefund();

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    // TODO: Check that transaction event "REFUND" was created in Saleor + amounts are OK
  });
});
