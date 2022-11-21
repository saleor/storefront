import { withSaleorDomainMatch } from "@/saleor-app-checkout/backend/middlewares";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import type { Request } from "retes";

const TEST_SALEOR_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL!;
const TEST_SALEOR_DOMAIN = new URL(TEST_SALEOR_URL).hostname;

jest.mock("@/saleor-app-checkout/backend/utils.ts");

const mockRequest: Request = {
  params: {},
  url: "",
  // @ts-expect-error Expects IncomingMessage, but object will do fine
  body: {},
  host: TEST_SALEOR_DOMAIN,
  method: "POST",
  context: {},
  headers: {},
};

describe("withSaleorDomainMatch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles missing Saleor domain in query", async () => {
    const handler = jest.fn();

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: TEST_SALEOR_DOMAIN,
      },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles missing Saleor domain in headers", async () => {
    const handler = jest.fn();

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      params: { ...mockRequest.params, saleorApiUrl: TEST_SALEOR_URL },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles empty Saleor domain in headers", async () => {
    const handler = jest.fn();

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: "",
      },
      params: { ...mockRequest.params, saleorApiUrl: TEST_SALEOR_URL },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles mismatched Saleor domain in headers", async () => {
    const handler = jest.fn();
    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: "some-other-comain.com",
      },
      params: { ...mockRequest.params, saleorApiUrl: TEST_SALEOR_URL },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles correct Saleor domain in request", async () => {
    const handler = jest.fn();

    await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: TEST_SALEOR_DOMAIN,
      },
      params: { ...mockRequest.params, saleorApiUrl: TEST_SALEOR_URL },
    });
    expect(handler).toHaveBeenCalled();
  });
});
