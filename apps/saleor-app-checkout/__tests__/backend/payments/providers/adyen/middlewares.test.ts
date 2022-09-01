import {
  AdyenRequestContext,
  isAdyenNotification,
  isAdyenWebhookAuthenticated,
  isAdyenWebhookHmacValid,
  withAdyenWebhookCredentials,
} from "@/saleor-app-checkout/backend/payments/providers/adyen/middlewares";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import type { Request } from "retes";
import { Response } from "retes/response";
import { validateHmac } from "@/saleor-app-checkout/backend/payments/providers/adyen/validator";
import { disableConsole } from "@/saleor-app-checkout/test-utils";

jest.mock("@/saleor-app-checkout/backend/configuration/settings");
jest.mock("@/saleor-app-checkout/backend/payments/providers/adyen/validator");

const mockedGetPrivateSettings = getPrivateSettings as jest.MockedFunction<
  typeof getPrivateSettings
>;
const mockedValidateHmac = validateHmac as jest.MockedFunction<typeof validateHmac>;

const TEST_REQUEST_DOMAIN = "vercel.com";
const TEST_ADYEN_PASSWORD = "password";
const TEST_ADYEN_USERNAME = "adyen_webhook";

const mockRequest: Request = {
  params: {},
  url: "",
  // @ts-expect-error Expects IncomingMessage, but object will do fine
  body: {},
  host: TEST_REQUEST_DOMAIN,
  method: "POST",
  context: {},
  headers: {},
};
const adyenConfig = {
  hmac: "123",
  apiKey: "123",
  password: TEST_ADYEN_PASSWORD,
  username: TEST_ADYEN_USERNAME,
  clientKey: "123",
  merchantAccount: "Saleor",
};

const requestWithNotification = {
  ...mockRequest,
  context: {
    ...adyenConfig,
  } as AdyenRequestContext,
  params: {
    live: "false",
    notificationItems: [
      {
        NotificationRequestItem: {
          additionalData: {
            hmacSignature: "123",
          },
        },
      },
    ],
  },
};

const mockPrivateSettings = (returnMockedSettings: boolean = true) => {
  if (!returnMockedSettings) {
    mockedGetPrivateSettings.mockResolvedValueOnce({
      paymentProviders: {
        adyen: {},
        mollie: {},
        stripe: {},
      },
    });
  }

  return mockedGetPrivateSettings.mockResolvedValueOnce({
    paymentProviders: {
      adyen: {
        hmac: "123",
        apiKey: "123",
        password: TEST_ADYEN_PASSWORD,
        username: TEST_ADYEN_USERNAME,
        clientKey: "123",
        merchantAccount: "Saleor",
      },
      mollie: {},
      stripe: {},
    },
  });
};

const handler = jest.fn(() => Response.OK("[accepted]"));

afterEach(() => {
  jest.clearAllMocks();
  handler.mockClear();
});

describe("withAdyenWebhookCredentials", () => {
  it("returns an error if it cannot fetch Adyen configuration", async () => {
    disableConsole("error");
    mockedGetPrivateSettings.mockRejectedValueOnce("Error while making request");

    const res = await withAdyenWebhookCredentials(handler)(mockRequest);
    expect(res.status).toBe(Response.InternalServerError().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns an error if it has missing Adyen configuration", async () => {
    disableConsole("error");
    mockPrivateSettings(false);

    const res = await withAdyenWebhookCredentials(handler)(mockRequest);
    expect(res.status).toBe(Response.InternalServerError().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("passes Adyen configuration as request context", async () => {
    mockedGetPrivateSettings.mockResolvedValueOnce({
      paymentProviders: {
        adyen: adyenConfig,
        mollie: {},
        stripe: {},
      },
    });

    await withAdyenWebhookCredentials(handler)(mockRequest);
    expect(handler).toHaveBeenCalledWith({
      ...mockRequest,
      context: {
        ...mockRequest.context,
        ...adyenConfig,
      },
    });
  });
});

describe("isAdyenNotification middleware", () => {
  it("rejects invalid request shape", async () => {
    const res = await isAdyenNotification(handler)(mockRequest);
    expect(res.status).toBe(Response.BadRequest().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("calls handler if request has correct shape", async () => {
    await isAdyenNotification(handler)(requestWithNotification);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe("isAdyenWebhookAuthenticated middleware", () => {
  it("returns error when request is missing auth header", async () => {
    mockPrivateSettings();

    const res = await isAdyenWebhookAuthenticated(handler)(mockRequest);
    expect(res.status).toBe(Response.Unauthorized().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns an error when authorization token is invalid", async () => {
    mockPrivateSettings();

    const res = await isAdyenWebhookAuthenticated(handler)({
      ...mockRequest,
      headers: {
        authorization: "Basic invalid_key",
      },
    });
    expect(res.status).toBe(Response.Unauthorized().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("passes request when authorization header is valid", async () => {
    mockPrivateSettings();

    const authToken = Buffer.from(
      TEST_ADYEN_USERNAME + ":" + TEST_ADYEN_PASSWORD,
      "ascii"
    ).toString("base64");

    const request = {
      ...mockRequest,
      context: adyenConfig,
      headers: {
        authorization: `Basic ${authToken}`,
      },
    };

    await isAdyenWebhookAuthenticated(handler)(request);
    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(request);
  });
});

describe("isAdyenWebhookHmacValid middleware", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns an error if notificationRequestItem is not present", async () => {
    const res = await isAdyenWebhookHmacValid(handler)(mockRequest);

    expect(res.status).toBe(Response.BadRequest().status);
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns an error if hmacSignature is not present uin request", async () => {
    mockedValidateHmac.mockRejectedValueOnce("Error - header not present");

    const res = await isAdyenWebhookHmacValid(handler)(requestWithNotification);

    expect(res.status).toBe(Response.Unauthorized().status);
    expect(handler).not.toHaveBeenCalled();
    expect(mockedValidateHmac).toHaveBeenCalledWith(expect.anything(), adyenConfig.hmac);
  });

  it("returns an error when hmac in request is invalid", async () => {
    mockedValidateHmac.mockResolvedValueOnce(false);

    const res = await isAdyenWebhookHmacValid(handler)(requestWithNotification);

    expect(res.status).toBe(Response.Unauthorized().status);
    expect(handler).not.toHaveBeenCalled();
    expect(mockedValidateHmac).toHaveBeenCalledWith(expect.anything(), adyenConfig.hmac);
  });

  it("passes request when hmac is valid", async () => {
    mockedValidateHmac.mockResolvedValueOnce(true);

    await isAdyenWebhookHmacValid(handler)(requestWithNotification);

    expect(handler).toHaveBeenCalled();
    expect(mockedValidateHmac).toHaveBeenCalledWith(expect.anything(), adyenConfig.hmac);
  });
});
