import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { apiErrors } from "@/checkout-storefront/lib/fixtures";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { act, renderHook } from "@testing-library/react-hooks";

describe("useErrors", () => {
  it("should enable setting api errors properly", () => {
    const { result: hook } = renderHook(() => useErrors<AddressFormData>());

    act(() => {
      hook.current.setApiErrors(apiErrors);
    });

    expect(hook.current.errors).toEqual({
      streetAddress1: {
        message: "Required field",
        code: "required",
      },
      postalCode: {
        message: "Invalid value",
        code: "invalid",
      },
    });
  });

  it("should return hasErrors set to true once the errors are set", () => {
    const { result: hook } = renderHook(() => useErrors<AddressFormData>());

    act(() => {
      hook.current.setApiErrors(apiErrors);
    });

    expect(hook.current.hasErrors).toEqual(true);
  });

  it("should clear errors properly", () => {
    const { result: hook } = renderHook(() => useErrors<AddressFormData>());

    act(() => {
      hook.current.setApiErrors(apiErrors);
    });

    act(() => {
      hook.current.clearErrors();
    });

    expect(hook.current.errors).toEqual({});
    expect(hook.current.hasErrors).toEqual(false);
  });
});
