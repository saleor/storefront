import {
  CheckoutBillingAddressUpdateMutation,
  CheckoutError,
  CheckoutShippingAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { apiErrors, checkout, urqlError } from "@/checkout-storefront/lib/fixtures";
import { extractMutationErrors, getById, getByUnmatchingId } from "@/checkout-storefront/lib/utils";
import { OperationResult } from "urql";

const items = [
  { name: "one", id: "one" },
  { name: "two", id: "two" },
  { name: "three", id: "three" },
  { name: "four", id: "four" },
];

describe("getById", () => {
  it("should allow filtering only matching elements", () => {
    expect(items.filter(getById("one"))).toEqual([items[0]]);
  });
});

describe("getByUnmatchingId", () => {
  it("should allow filtering only unmatching elements", () => {
    expect(items.filter(getByUnmatchingId("two"))).toEqual([items[0], items[2], items[3]]);
  });
});

describe("extractMutationErrors", () => {
  it("should return proper true and filled array for result with api errors", () => {
    const result: Pick<
      OperationResult<CheckoutShippingAddressUpdateMutation & CheckoutBillingAddressUpdateMutation>,
      "data"
    > = {
      data: {
        checkoutShippingAddressUpdate: {
          checkout: null,
          errors: [apiErrors[0] as CheckoutError],
        },
        checkoutBillingAddressUpdate: {
          checkout: null,
          errors: [apiErrors[1] as CheckoutError],
        },
      },
    };

    expect(extractMutationErrors(result)).toEqual([true, apiErrors]);
  });

  it("should return false and empty array for result without api errors", () => {
    const result: Pick<
      OperationResult<CheckoutShippingAddressUpdateMutation & CheckoutBillingAddressUpdateMutation>,
      "data"
    > = {
      data: {
        checkoutShippingAddressUpdate: {
          checkout,
          errors: [],
        },
        checkoutBillingAddressUpdate: {
          checkout,
          errors: [],
        },
      },
    };

    expect(extractMutationErrors(result)).toEqual([false, []]);
  });

  it("should return true and urql errors array if any", () => {
    const result: Pick<
      OperationResult<CheckoutShippingAddressUpdateMutation & CheckoutBillingAddressUpdateMutation>,
      "error" | "data"
    > = {
      error: urqlError,
      data: {
        checkoutShippingAddressUpdate: {
          checkout,
          errors: [],
        },
        checkoutBillingAddressUpdate: {
          checkout,
          errors: [],
        },
      },
    };

    expect(extractMutationErrors(result)).toEqual([true, [urqlError]]);
  });
});
