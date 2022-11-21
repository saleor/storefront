import { getQueryParams, getRawQueryParams } from "@/checkout-storefront/lib/utils/url";

const search = "?checkout=1234&locale=en-US&email=dummy@saeor.io";

describe("getRawQueryParams", () => {
  it("should return query params with unmapped names", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        search,
      },
    });

    expect(getRawQueryParams()).toEqual({
      locale: "en-US",
      email: "dummy@saeor.io",
      checkout: "1234",
    });
  });
});

describe("getQueryParams", () => {
  it("should return query params with mapped names", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        search,
      },
    });

    expect(getQueryParams()).toEqual({
      locale: "en-US",
      passwordResetEmail: "dummy@saeor.io",
      checkoutId: "1234",
    });
  });
});
