import { verifyStripeEventSignature } from "@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler";
import handler from "@/saleor-app-checkout/pages/api/webhooks/stripe";
import {
  mockRequestStream,
  setupPollyMiddleware,
  setupRecording,
} from "@/saleor-app-checkout/test-utils";

jest.mock("@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler");
const mockVerifyStripeEventSignature = verifyStripeEventSignature as jest.Mock;

describe("/api/webhooks/stripe", () => {
  const context = setupRecording();

  beforeEach(() => {
    setupPollyMiddleware(context.polly.server);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 on missing signature header", async () => {
    mockVerifyStripeEventSignature.mockRestore();
    const { req, res } = mockRequestStream("POST", {
      headers: {},
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should return 500 on invalid signature header", async () => {
    mockVerifyStripeEventSignature.mockRestore();
    const { req, res } = mockRequestStream("POST", {
      headers: {
        "stripe-signature": "blah blah blah",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it("should return X", async () => {
    // return mocked event
    mockVerifyStripeEventSignature.mockResolvedValue({});

    const { req, res } = mockRequestStream("POST", {
      headers: {
        "stripe-signature": "blah blah blah",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(204);
  });
});
