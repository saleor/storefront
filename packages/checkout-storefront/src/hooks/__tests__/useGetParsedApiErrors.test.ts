import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { renderHook } from "@testing-library/react-hooks";
import { apiErrors } from "@/checkout-storefront/lib/fixtures";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { getMockProviders } from "@/checkout-storefront/__tests__/utils";

type TestFormData = AddressFormData;

describe("useGetParsedApiErrors", () => {
  it("should return properly formatted errors from api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>(), {
      wrapper: getMockProviders(),
    });

    const errors = [
      ...apiErrors,
      {
        code: "PASSWORD_TOO_SHORT",
        message: "This password is not long enough",
        field: "password",
      },
    ];

    expect(hook.current.getParsedApiErrors(errors as ApiErrors<TestFormData>)).toEqual([
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
      wrapper: getMockProviders(),
    });
    expect(hook.current.getParsedApiErrors([])).toEqual([]);
  });

  it("should return proper form errors object from api errors array", () => {
    const { result: hook } = renderHook(() => useGetParsedApiErrors<TestFormData>(), {
      wrapper: getMockProviders(),
    });

    const errors = [
      ...apiErrors,
      {
        code: "PASSWORD_TOO_SHORT",
        message: "This password is not long enough",
        field: "password",
      },
    ];

    expect(hook.current.getFormErrorsFromApiErrors(errors as ApiErrors<TestFormData>)).toEqual({
      streetAddress1: {
        message: "Required field",
        code: "required",
      },
      postalCode: {
        message: "Invalid value",
        code: "invalid",
      },
      password: {
        message: "Provided password is too short. Minimum length is 8 characters.",
        code: "passwordTooShort",
      },
    });
  });
});
