import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { renderHook } from "@testing-library/react-hooks";
import { apiErrors } from "@/checkout-storefront/lib/fixtures";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";
import { getMockProviders } from "@/checkout-storefront/__tests__/utils";

type TestFormData = AddressFormData & CheckoutFormData;

describe("useGetParsedApiErrors", () => {
  it("should return properly formatted errors from api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>(), {
      wrapper: getMockProviders({ intl: true }),
    });

    const errors = [
      ...apiErrors,
      {
        code: "PASSWORD_TOO_SHORT",
        message: "This password is not long enough",
        field: "password",
      },
    ];

    expect(hook.current(errors as ApiErrors<TestFormData>)).toEqual([
      {
        message: "Required field",
        field: "streetAddress1",
        code: "required",
      },
      {
        message: "Invalid value",
        field: "postalCode",
        code: "invalid",
      },
      {
        message: "Provided password is too short. Minimum length is 8 characters.",
        field: "password",
        code: "passwordTooShort",
      },
    ]);
  });

  it("should return empty array for empty api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>(), {
      wrapper: getMockProviders({ intl: true }),
    });
    expect(hook.current([])).toEqual([]);
  });
});
