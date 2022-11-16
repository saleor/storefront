import { usePhoneNumberUtils } from "@/checkout-storefront/hooks/usePhoneNumberUtils";
import { renderHook } from "@testing-library/react-hooks";

const countryCode = "PL";

describe("isValidPhoneNumber", () => {
  it("should return true for valid phone numbers", () => {
    const { result: hook } = renderHook(() => usePhoneNumberUtils());

    expect(hook.current.isValidNumber("+48172268096", countryCode)).toEqual(true);
    expect(hook.current.isValidNumber("172268096", countryCode)).toEqual(true);
  });

  it("should return false for invalid phone numbers", () => {
    const { result: hook } = renderHook(() => usePhoneNumberUtils());

    expect(hook.current.isValidNumber("+4172268096", countryCode)).toEqual(false);
    expect(hook.current.isValidNumber("+48111111111", countryCode)).toEqual(false);
    expect(hook.current.isValidNumber("123", countryCode)).toEqual(false);
    expect(hook.current.isValidNumber("foobar", countryCode)).toEqual(false);
    expect(hook.current.isValidNumber("+48", countryCode)).toEqual(false);
  });
});
