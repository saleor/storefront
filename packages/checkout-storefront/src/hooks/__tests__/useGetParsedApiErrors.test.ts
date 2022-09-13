import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { renderHook } from "@testing-library/react-hooks";
import { apiErrors } from "@/checkout-storefront/lib/fixtures";
import { AddressFormData } from "@/checkout-storefront/sections/Addresses/types";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";

type TestFormData = AddressFormData & CheckoutFormData;

describe("useGetParsedApiErrors", () => {
  it("should return properly formatted errors from api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>());

    const errors = [
      ...apiErrors,
      {
        code: "PASSWORD_TOO_COMMON",
        message: "This password is not fancy enough",
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
        message: "Provided password is too common.",
        field: "password",
        code: "passwordTooCommon",
      },
    ]);
  });

  it("should return empty array for empty api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>());
    expect(hook.current([])).toEqual([]);
  });
});
