import { verifyStripeEventSignature } from "@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler";
import handler from "@/saleor-app-checkout/pages/api/webhooks/stripe";
import {
  disableConsole,
  mockRequestStream,
  setupPollyMiddleware,
  setupRecording,
} from "@/saleor-app-checkout/test-utils";

jest.mock("@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler", () => ({
  ...jest.requireActual("@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler"),
  verifyStripeEventSignature: jest.fn(),
}));
const mockVerifyStripeEventSignature = verifyStripeEventSignature as jest.Mock;

describe("/api/webhooks/stripe", () => {
  const context = setupRecording();

  beforeEach(() => {
    setupPollyMiddleware(context.polly.server);
  });

  afterEach(() => context.polly.flush());

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

  it("should return 204 when event is unknown", async () => {
    // return mocked event
    mockVerifyStripeEventSignature.mockResolvedValue({
      type: "unknown",
    });

    const { req, res } = mockRequestStream("POST", {
      headers: {
        "stripe-signature": "blah blah blah",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(204);
  });

  it("should update transaction", async () => {
    disableConsole("info");
    // return mocked event
    mockVerifyStripeEventSignature.mockResolvedValue({
      id: "evt_1LXWzCEosEcNBN5msbniFSuj",
      object: "event",
      api_version: "2022-08-01",
      created: 1660684062,
      data: {
        object: {
          id: "cs_test_b1rFL3ne5vJwFITea5tObeCZleiEKYx9Lpqi9sicSN2iN76A6kIE5F5pTc",
          object: "checkout.session",
          after_expiration: null,
          allow_promotion_codes: null,
          amount_subtotal: 921,
          amount_total: 921,
          automatic_tax: { enabled: false, status: null },
          billing_address_collection: null,
          cancel_url:
            "https://saleor-domain-testing.saleor.live/checkout-spa?order=T3JkZXI6ODIwMDdiOTQtYzc2ZC00MGYxLWE0OGUtNzFjZWFiMGU2OWVi",
          client_reference_id: null,
          consent: null,
          consent_collection: null,
          currency: "usd",
          customer: "cus_MG35vY0kj4h61Y",
          customer_creation: null,
          customer_details: {
            address: {
              city: "WROCLAW",
              country: "PL",
              line1: "Test Street 21/37",
              line2: "",
              postal_code: "45-573",
              state: "",
            },
            email: "saleor@example.com",
            name: "Jan Kowalski",
            phone: null,
            tax_exempt: "none",
            tax_ids: [],
          },
          customer_email: null,
          expires_at: 1660770441,
          livemode: false,
          locale: "en",
          metadata: { orderId: "T3JkZXI6ODIwMDdiOTQtYzc2ZC00MGYxLWE0OGUtNzFjZWFiMGU2OWVi" },
          mode: "payment",
          payment_intent: "pi_3LXWz9EosEcNBN5m03w4t20q",
          payment_link: null,
          payment_method_collection: "always",
          payment_method_options: {},
          payment_method_types: ["card"],
          payment_status: "paid",
          phone_number_collection: { enabled: false },
          recovered_from: null,
          setup_intent: null,
          shipping_address_collection: null,
          shipping_cost: null,
          shipping_details: null,
          shipping_options: [],
          status: "complete",
          submit_type: null,
          subscription: null,
          success_url:
            "https://saleor-domain-testing.saleor.live/checkout-spa?order=T3JkZXI6ODIwMDdiOTQtYzc2ZC00MGYxLWE0OGUtNzFjZWFiMGU2OWVi",
          total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
          url: null,
        },
      },
      livemode: false,
      pending_webhooks: 2,
      request: { id: null, idempotency_key: null },
      type: "checkout.session.completed",
    });

    const { req, res } = mockRequestStream("POST", {
      headers: {
        "stripe-signature": "blah blah blah",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(204);
  });
});
