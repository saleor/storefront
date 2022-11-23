import {
  isValidPhoneNumber,
  getPhoneNumberWithCountryCode,
} from "@/checkout-storefront/lib/utils/phoneNumber";

const countryCode = "PL";

describe("isValidPhoneNumber", () => {
  it("should return true for valid phone numbers", () => {
    expect(isValidPhoneNumber("+48172268096", countryCode)).toEqual(true);
    expect(isValidPhoneNumber("172268096", countryCode)).toEqual(true);
  });

  it("should return false for invalid phone numbers", () => {
    expect(isValidPhoneNumber("+4172268096", countryCode)).toEqual(false);
    expect(isValidPhoneNumber("+48111111111", countryCode)).toEqual(false);
    expect(isValidPhoneNumber("123", countryCode)).toEqual(false);
    expect(isValidPhoneNumber("foobar", countryCode)).toEqual(false);
    expect(isValidPhoneNumber("+48", countryCode)).toEqual(false);
  });
});

describe("getPhoneNumberWithCountryCode", () => {
  it("should return phone with added country code for valid phone with no code provided", () => {
    expect(getPhoneNumberWithCountryCode("172268096", countryCode)).toEqual("+48172268096");
  });

  it("should return unchanged phone for valid phone with code provided", () => {
    expect(getPhoneNumberWithCountryCode("+48172268096", countryCode)).toEqual("+48172268096");
  });

  it("should return unchanged phone number for invalid number", () => {
    expect(getPhoneNumberWithCountryCode("+4172268096", countryCode)).toEqual("+4172268096");
    expect(getPhoneNumberWithCountryCode("+48111111111", countryCode)).toEqual("+48111111111");
    expect(getPhoneNumberWithCountryCode("123", countryCode)).toEqual("123");
    expect(getPhoneNumberWithCountryCode("foobar", countryCode)).toEqual("foobar");
    expect(getPhoneNumberWithCountryCode("+48", countryCode)).toEqual("+48");
  });
});
