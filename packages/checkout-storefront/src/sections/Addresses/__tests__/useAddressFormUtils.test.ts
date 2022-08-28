import { validationRules } from "@/checkout-storefront/lib/fixtures/address";
import { useAddressFormUtils } from "@/checkout-storefront/sections/Addresses/useAddressFormUtils";
import { renderHook } from "@testing-library/react-hooks";

describe("isRequiredField", () => {
  it("should return true for required field", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(validationRules));

    expect(hook.current.isRequiredField("city")).toEqual(true);
  });

  it("should return false for not required field", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(validationRules));

    expect(hook.current.isRequiredField("companyName")).toEqual(false);
  });
});

describe("getFieldLabel", () => {
  it("should return localized field label when available", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(validationRules));

    expect(hook.current.getFieldLabel("countryArea")).toEqual("Province");
  });

  it("should return unlocalized field label when otherwise unavailable", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(validationRules));

    expect(hook.current.getFieldLabel("companyName")).toEqual("Company");
  });
});
