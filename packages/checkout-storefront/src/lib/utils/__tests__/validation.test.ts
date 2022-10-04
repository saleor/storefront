import { validationErrors } from "@/checkout-storefront/lib/fixtures";
import { getErrorsAsObject } from "@/checkout-storefront/lib/utils/validation";

describe("getErrorsAs", () => {
  it("should return proper object from errors array", () => {
    expect(getErrorsAsObject(validationErrors)).toEqual({
      city: {
        message: "This is not unique",
        type: "unique",
      },
      firstName: {
        message: "This is highly irregular",
        type: "invalid",
      },
      streetAddress1: {
        message: "This is missing",
        type: "required",
      },
    });
  });

  it("should return empty object from empty errors array", () => {
    expect(getErrorsAsObject([])).toEqual({});
  });
});
