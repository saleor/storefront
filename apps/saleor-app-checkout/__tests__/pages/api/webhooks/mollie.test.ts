import { paymentProviders } from "@/saleor-app-checkout/mocks/fixtures/saleor";
import handler from "@/saleor-app-checkout/pages/api/webhooks/mollie";
import {
  mockRequest,
  setupPollyMiddleware,
  setupRecording,
} from "@/saleor-app-checkout/test-utils";

describe("/api/webhooks/mollie", () => {
  const context = setupRecording();

  beforeEach(() => {
    setupPollyMiddleware(context.polly.server);
  });

  it("handles invalid (empty) requests payments", async () => {
    const { req, res } = mockRequest("POST");
    req.body = {};

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("handles requests with invalid orderId", async () => {
    const { req, res } = mockRequest("POST");

    req.body = {
      id: "invalid_id",
    };

    await handler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it("handles request with completed payment", async () => {
    const { req, res } = mockRequest("POST");

    req.body = {
      id: paymentProviders.mollie.completedOrderId,
    };

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});
