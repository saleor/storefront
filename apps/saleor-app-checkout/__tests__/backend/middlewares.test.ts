import { withSaleorDomainMatch } from "@/saleor-app-checkout/backend/middlewares";
import { getSaleorDomain } from "@/saleor-app-checkout/backend/utils";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import type { Request } from "retes";

const TEST_SALEOR_DOMAIN = "master.staging.saleor.cloud";

jest.mock("@/saleor-app-checkout/backend/utils.ts");

const mockedGetSaleorDomain = getSaleorDomain as jest.MockedFunction<typeof getSaleorDomain>;

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

  it("handles missing Saleor domain in configuration", async () => {
    const handler = jest.fn();
    mockedGetSaleorDomain.mockRejectedValue("Missing value");

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: TEST_SALEOR_DOMAIN,
      },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(500);
    expect(handler).not.toHaveBeenCalled();
    mockedGetSaleorDomain.mockRestore();
  });

  it("handles missing Saleor domain in request", async () => {
    const handler = jest.fn();
    mockedGetSaleorDomain.mockResolvedValue(TEST_SALEOR_DOMAIN);

    const result = await withSaleorDomainMatch(handler)(mockRequest);
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles empty Saleor domain in request", async () => {
    const handler = jest.fn();
    mockedGetSaleorDomain.mockResolvedValue(TEST_SALEOR_DOMAIN);

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: "",
      },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles mismatched Saleor domain in request", async () => {
    const handler = jest.fn();
    mockedGetSaleorDomain.mockResolvedValue(TEST_SALEOR_DOMAIN);

    const result = await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: "some-other-comain.com",
      },
    });
    expect(result.body).toHaveProperty("success", false);
    expect(result.body).toHaveProperty("message");
    expect(result.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles correct Saleor domain in request", async () => {
    const handler = jest.fn();
    mockedGetSaleorDomain.mockResolvedValue(TEST_SALEOR_DOMAIN);

    await withSaleorDomainMatch(handler)({
      ...mockRequest,
      headers: {
        [SALEOR_DOMAIN_HEADER]: TEST_SALEOR_DOMAIN,
      },
    });
    expect(handler).toHaveBeenCalled();
  });
});
