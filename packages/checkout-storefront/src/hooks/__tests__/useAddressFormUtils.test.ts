import { AddressValidationRulesQuery } from "@/checkout-storefront/graphql";
import { validationRules } from "@/checkout-storefront/lib/fixtures/address";
import { renderHook } from "@testing-library/react-hooks";
import { fromValue } from "wonka";
import { getMockProviders } from "@/checkout-storefront/__tests__/utils";
import { useAddressFormUtils } from "@/checkout-storefront/hooks/useAddressFormUtils";
import { defaultCountry } from "@/checkout-storefront/lib/consts";

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
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedSuccessResponse }),
    });
    expect(hook.current.isRequiredField("city")).toEqual(true);
  });

  it("should return false for not required field", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedSuccessResponse }),
    });

    expect(hook.current.isRequiredField("companyName")).toEqual(false);
  });

  it("should return false for failed validation rules query", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedFailResponse }),
    });

    expect(hook.current.isRequiredField("companyName")).toEqual(false);
  });
});

describe("getFieldLabel", () => {
  it("should return localized field label when available", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedSuccessResponse }),
    });

    expect(hook.current.getFieldLabel("countryArea")).toEqual("Province");
  });

  it("should return unlocalized field label when otherwise unavailable", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedSuccessResponse }),
    });

    expect(hook.current.getFieldLabel("companyName")).toEqual("Company");
  });

  it("should return unlocalized field label for failed validation rules query", () => {
    const { result: hook } = renderHook(() => useAddressFormUtils(defaultCountry), {
      wrapper: getMockProviders({ mockedResponseState: mockedFailResponse }),
    });
    expect(hook.current.getFieldLabel("countryArea")).toEqual("Country area");
  });
});
