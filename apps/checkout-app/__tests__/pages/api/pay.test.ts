import pay, { Body, ErrorResponse, SuccessResponse } from "@/pages/api/pay";
import { mockRequest } from "@/test-utils";

import { createMolliePayment } from "@/backend/payments/providers/mollie";
import { createOrder } from "@/backend/payments/createOrder";

jest.mock("@/backend/payments/createOrder");
jest.mock("@/backend/payments/providers/mollie");
jest.mock("@mollie/api-client");
jest.mock("urql");

const mockedCreateOrder = <jest.Mock>createOrder;
const mockedCreateMolliePayment = <jest.Mock>createMolliePayment;

describe("/api/pay", () => {
  it("rejects when wrong request method is used", async () => {
    const { req, res } = mockRequest("GET");

    // @ts-ignore
    await pay(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("throws an error if incorrect provider is passed", async () => {
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "unknown",
      totalAmount: 100,
    };

    // @ts-ignore
    await pay(req, res);

    expect(mockedCreateOrder).not.toHaveBeenCalled();
    expect(mockedCreateMolliePayment).not.toHaveBeenCalled();

    const data: ErrorResponse = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.errors.length).toBe(1);
    expect(data.errors[0]).toBe("UNKNOWN_PROVIDER");
  });

  it("accepts and processes payment: mollie", async () => {
    const mockOrderData = {};

    mockedCreateOrder.mockImplementationOnce(() => ({ data: mockOrderData }));
    mockedCreateMolliePayment.mockImplementationOnce(() => ({
      href: "mollie-redirect-url",
    }));
    const { req, res } = mockRequest("POST");

    req.body = {
      checkoutId: "id",
      provider: "mollie",
      totalAmount: 100,
    } as Body;

    // @ts-ignore
    await pay(req, res);

    expect(mockedCreateOrder).toHaveBeenCalledWith("id", 100);
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);

    expect(mockedCreateMolliePayment).toHaveBeenCalledWith(mockOrderData);
    expect(mockedCreateMolliePayment).toHaveBeenCalledTimes(1);

    const data: SuccessResponse = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.provider).toBe("mollie");
    expect(data.data.checkoutUrl).toBe("mollie-redirect-url");
  });
});
