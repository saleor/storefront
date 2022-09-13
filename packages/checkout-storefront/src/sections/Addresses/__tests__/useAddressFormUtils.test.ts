import { AddressValidationRulesQuery } from "@/checkout-storefront/graphql";
import { validationRules } from "@/checkout-storefront/lib/fixtures/address";
import { useAddressFormUtils } from "@/checkout-storefront/sections/Addresses/useAddressFormUtils";
import { renderHook } from "@testing-library/react-hooks";
import { fromValue } from "wonka";
import { getMockUrqlProvider } from "@/checkout-storefront/__tests__/utils";
import { defaultCountry } from "@/checkout-storefront/sections/Addresses/countries";

const mockedSuccessResponse = {
  executeQuery: () =>
    fromValue({
      data: {
        addressValidationRules: validationRules,
      } as AddressValidationRulesQuery,
    }),
};
const mockedFailResponse = {
  executeQuery: () =>
    fromValue({
      data: {
        addressValidationRules: null,
      } as AddressValidationRulesQuery,
    }),
};
describe("isRequiredField", () => {
  it("should return true for required field", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedSuccessResponse),
    });

    expect(hook.current.isRequiredField("city")).toEqual(true);
  });

  it("should return false for not required field", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedSuccessResponse),
    });

    expect(hook.current.isRequiredField("companyName")).toEqual(false);
  });

  it("should return false for failed validation rules query", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedFailResponse),
    });

    expect(hook.current.isRequiredField("companyName")).toEqual(false);
  });
});

describe("getFieldLabel", () => {
  it("should return localized field label when available", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedSuccessResponse),
    });

    expect(hook.current.getFieldLabel("countryArea")).toEqual("Province");
  });

  it("should return unlocalized field label when otherwise unavailable", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedSuccessResponse),
    });

    expect(hook.current.getFieldLabel("companyName")).toEqual("Company");
  });

  it("should return unlocalized field label for failed validation rules query", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry.code), {
      wrapper: getMockUrqlProvider(mockedFailResponse),
    });

    expect(hook.current.getFieldLabel("companyName")).toEqual("Company");
  });
});
