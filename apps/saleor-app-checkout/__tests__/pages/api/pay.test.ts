import {
  PayRequestErrorResponse,
  PayRequestSuccessResponse,
} from "@/saleor-app-checkout/types/api/pay";
import { PayRequestBody } from "checkout-common";
import pay from "@/saleor-app-checkout/pages/api/pay";
import { mockRequest } from "@/saleor-app-checkout/test-utils";

import { createMolliePayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { createAdyenPayment } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { createOrder } from "@/saleor-app-checkout/backend/payments/createOrder";
import { updatePaymentMetafield } from "@/saleor-app-checkout/backend/payments/updatePaymentMetafield";
import {
  verifyMollieSession,
  reuseExistingMollieSession,
} from "@/saleor-app-checkout/backend/payments/providers/mollie/verifySession";
import {
  verifyAdyenSession,
  reuseExistingAdyenSession,
} from "@/saleor-app-checkout/backend/payments/providers/adyen/verifySession";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import type { OrderStatus as MollieOrderStatus } from "@mollie/api-client";

jest.mock("@/saleor-app-checkout/backend/payments/createOrder");
jest.mock("@/saleor-app-checkout/backend/payments/providers/mollie");
jest.mock("@/saleor-app-checkout/backend/payments/providers/adyen");
jest.mock("@/saleor-app-checkout/backend/payments/updatePaymentMetafield");
jest.mock("@/saleor-app-checkout/backend/payments/providers/adyen/verifySession");
jest.mock("@/saleor-app-checkout/backend/payments/providers/mollie/verifySession");
jest.mock("@mollie/api-client");
jest.mock("urql");

const mockedCreateOrder = <jest.Mock>createOrder;
const mockedCreateMolliePayment = <jest.Mock>createMolliePayment;
const mockedCreateAdyenPayment = <jest.Mock>createAdyenPayment;
const mockedUpdatePaymentMetafield = <jest.Mock>updatePaymentMetafield;
const mockedVerifyAdyenSession = <jest.Mock>verifyAdyenSession;
const mockReuseExistingAdyenSession = <jest.Mock>reuseExistingAdyenSession;
const mockedVerifyMollieSession = <jest.Mock>verifyMollieSession;
const mockReuseExistingMollieSession = <jest.Mock>reuseExistingMollieSession;

describe("/api/pay", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("rejects when wrong request method is used", async () => {
    const { req, res } = mockRequest("GET");

    await pay(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("throws an error if incorrect provider is passed", async () => {
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "unknown",
      method: "creditCard",
      totalAmount: 100,
    };

    await pay(req, res);

    expect(mockedCreateOrder).not.toHaveBeenCalled();
    expect(mockedCreateMolliePayment).not.toHaveBeenCalled();

    const data = res._getJSONData<PayRequestErrorResponse>();
    expect(res.statusCode).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.errors.length).toBe(1);
    expect(data.errors[0]).toBe("UNKNOWN_PROVIDER");
  });

  it("accepts and processes new payment: mollie", async () => {
    const mockOrderData = {} as OrderFragment;

    mockedCreateOrder.mockResolvedValueOnce({ data: mockOrderData });
    mockedCreateMolliePayment.mockResolvedValueOnce({
      url: "mollie-redirect-url",
      id: "test-id",
    });
    mockedUpdatePaymentMetafield.mockResolvedValueOnce(true);

    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "mollie",
      method: "creditCard",
      totalAmount: 100,
      redirectUrl: "example.com",
    } as PayRequestBody;

    req.headers = {
      host: "app.com",
    };

    await pay(req, res);

    expect(mockedCreateOrder).toHaveBeenCalledWith("id", 100);
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);

    expect(mockedCreateMolliePayment).toHaveBeenCalledWith({
      order: mockOrderData,
      method: "creditCard",
      redirectUrl: "example.com",
      appUrl: "http://app.com",
    });
    expect(mockedCreateMolliePayment).toHaveBeenCalledTimes(1);

    const data = res._getJSONData<PayRequestSuccessResponse>();

    expect(res.statusCode).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.provider).toBe("mollie");
    expect(data.data.paymentUrl).toBe("mollie-redirect-url");
  });

  it("accepts and reuses existing payment session: mollie", async () => {
    const mockOrderData = {
      privateMetafield: JSON.stringify({
        provider: "mollie",
        session: "session-id-1",
        method: "creditCard",
      }),
    } as OrderFragment;

    mockedCreateOrder.mockResolvedValueOnce({ data: mockOrderData });
    mockedVerifyMollieSession.mockResolvedValueOnce({
      status: "created" as MollieOrderStatus,
      url: "mollie-redirect-url",
    });
    mockReuseExistingMollieSession.mockResolvedValueOnce({
      ok: true,
      provider: "mollie",
      data: { paymentUrl: "mollie-redirect-url" },
    });
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "mollie",
      method: "creditCard",
      totalAmount: 100,
      redirectUrl: "example.com",
    } as PayRequestBody;

    req.headers = {
      host: "app.com",
    };

    await pay(req, res);

    expect(mockedCreateOrder).toHaveBeenCalledWith("id", 100);
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockedCreateMolliePayment).not.toHaveBeenCalled();
    expect(mockedUpdatePaymentMetafield).not.toHaveBeenCalled();

    const data = res._getJSONData<PayRequestSuccessResponse>();

    expect(res.statusCode).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.provider).toBe("mollie");
    expect(data.data.paymentUrl).toBe("mollie-redirect-url");
  });

  it("accepts and processes new payment: adyen", async () => {
    const mockOrderData = {
      privateMetafield: JSON.stringify({
        provider: "adyen",
        session: "session-id-2",
        method: "creditCard",
      }),
    } as OrderFragment;

    mockedCreateOrder.mockResolvedValueOnce({ data: mockOrderData });
    mockedCreateAdyenPayment.mockResolvedValueOnce({
      url: "adyen-redirect-url",
      id: "test-id",
    });
    mockedUpdatePaymentMetafield.mockResolvedValueOnce(true);
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "adyen",
      method: "creditCard",
      totalAmount: 100,
      redirectUrl: "example.com",
    } as PayRequestBody;

    await pay(req, res);

    expect(mockedCreateOrder).toHaveBeenCalledWith("id", 100);
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);

    expect(mockedCreateAdyenPayment).toHaveBeenCalledWith({
      appUrl: "http://undefined",
      method: "creditCard",
      order: {
        privateMetafield: '{"provider":"adyen","session":"session-id-2","method":"creditCard"}',
      },
      redirectUrl: "example.com",
    });
    expect(mockedCreateAdyenPayment).toHaveBeenCalledTimes(1);

    const data = res._getJSONData<PayRequestSuccessResponse>();
    expect(res.statusCode).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.provider).toBe("adyen");
    expect(data.data.paymentUrl).toBe("adyen-redirect-url");
  });

  it("accepts and reuses existing payment session: adyen", async () => {
    const mockOrderData = {
      privateMetafield: JSON.stringify({
        provider: "adyen",
        session: "session-id-2",
        method: "creditCard",
      }),
    } as OrderFragment;

    mockReuseExistingAdyenSession.mockResolvedValueOnce({
      ok: true,
      provider: "adyen",
      data: { paymentUrl: "adyen-redirect-url" },
    });
    mockedCreateOrder.mockResolvedValueOnce({ data: mockOrderData });
    mockedVerifyAdyenSession.mockResolvedValueOnce({
      status: 0, // "active"
      url: "adyen-redirect-url",
    });
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "adyen",
      method: "creditCard",
      totalAmount: 100,
      redirectUrl: "example.com",
    } as PayRequestBody;

    req.headers = {
      host: "app.com",
    };

    await pay(req, res);

    expect(mockedCreateOrder).toHaveBeenCalledWith("id", 100);
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockedCreateAdyenPayment).not.toHaveBeenCalled();
    expect(mockedUpdatePaymentMetafield).not.toHaveBeenCalled();

    const data = res._getJSONData<PayRequestSuccessResponse>();

    expect(res.statusCode).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.provider).toBe("adyen");
    expect(data.data.paymentUrl).toBe("adyen-redirect-url");
  });
});
