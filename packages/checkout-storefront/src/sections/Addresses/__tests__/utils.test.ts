import { AddressFragment } from "@/checkout-storefront/graphql";
import { addresses } from "@/checkout-storefront/lib/fixtures/address";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import {
  emptyFormData,
  getAddressFormDataFromAddress,
  getMatchingAddressFromList,
  getOrderedAddressFields,
  isMatchingAddress,
} from "@/checkout-storefront/sections/Addresses/utils";
import { omit } from "lodash-es";

describe("getAddressFormDataFromAddress", () => {
  it("should return empty form data for non-existing address", () => {
    expect(getAddressFormDataFromAddress(null)).toEqual(emptyFormData);
  });

  it("should return properly formatted form data from adress", () => {
    const address = addresses[0];
    expect(getAddressFormDataFromAddress(address)).toEqual({
      ...omit(address, "country"),
      countryCode: address?.country.code,
    });
  });
});

describe("isMatchingAddress", () => {
  it("should return true for addresses of same id", () => {
    const address = { ...addresses[0], id: "some-id" } as AddressFragment;
    const addressToCompare = { ...addresses[1], id: "some-id" } as AddressFragment;

    expect(isMatchingAddress(address, addressToCompare)).toEqual(true);
  });

  it("should return true for addresses of different id but same data", () => {
    const address = { ...addresses[0], id: "some-id" } as AddressFragment;
    const addressToCompare = { ...addresses[0], id: "some-other-id" } as AddressFragment;

    expect(isMatchingAddress(address, addressToCompare)).toEqual(true);
  });

  it("should return false for different addresses", () => {
    const address = addresses[0];
    const addressToCompare = addresses[1];

    expect(isMatchingAddress(address, addressToCompare)).toEqual(false);
  });
});

describe("getMatchingAddressFromList", () => {
  const [firstAddress, ...rest] = addresses;
  const addressList = [{ ...firstAddress, id: "some-id" } as AddressFragment, ...rest];

  const getMatchingAddress = getMatchingAddressFromList(addressList);

  it("should return proper address for addresses of same id", () => {
    const addressToCompare = { ...addresses[1], id: "some-id" } as AddressFragment;

    expect(getMatchingAddress(addressToCompare)).toEqual(addressList[0]);
  });

  it("should return proper address for addresses of different id but same data", () => {
    const addressToCompare = { ...addresses[0], id: "some-other-id" } as AddressFragment;

    expect(getMatchingAddress(addressToCompare)).toEqual(addressList[0]);
  });

  it("should return undefined for address that doesn't match any in the list", () => {
    const addressToCompare = {
      ...emptyFormData,
      country: { code: "PL", country: "Polska" },
      id: "some-other-id",
    } as AddressFragment;

    expect(getMatchingAddress(addressToCompare)).toEqual(undefined);
  });

  it("should return undefined for not existing address passed to check function", () => {
    expect(getMatchingAddress(null)).toEqual(undefined);
    expect(getMatchingAddress(undefined)).toEqual(undefined);
  });
});

describe("getOrderedAddressFields", () => {
  it("should return properly ordered fields", () => {
    const unorderedAddressFields: AddressField[] = [
      "city",
      "lastName",
      "postalCode",
      "firstName",
      "companyName",
      "cityArea",
      "phone",
    ];

    expect(getOrderedAddressFields(unorderedAddressFields)).toEqual([
      "firstName",
      "lastName",
      "companyName",
      "phone",
      "city",
      "postalCode",
      "cityArea",
    ]);
  });
});
