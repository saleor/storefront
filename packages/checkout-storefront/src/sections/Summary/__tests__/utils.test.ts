import { CheckoutLineFragment } from "@/checkout-storefront/graphql";
import { checkout } from "@/checkout-storefront/lib/fixtures";
import {
  useSummaryLineLineAttributesText,
  isCheckoutLine,
} from "@/checkout-storefront/sections/Summary/utils";
import { renderHook } from "@testing-library/react-hooks";
import { getMockProviders } from "@/checkout-storefront/__tests__/utils";

describe("useSummaryLineAttributesText", () => {
  it("should return properly formatted string for line with attributes", () => {
    const line = checkout.lines[0];

    const { result: hook } = renderHook(
      () => useSummaryLineLineAttributesText(line as CheckoutLineFragment),
      {
        wrapper: getMockProviders(),
      }
    );

    expect(hook.current).toEqual("White, 45cm x 45cm, aaaa, 1, 700ml, XS");
  });

  it("should return empty string for line without attributes", () => {
    const line = {
      ...checkout.lines[0],
      variant: { ...checkout.lines[0]?.variant, attributes: [] },
    };

    const { result: hook } = renderHook(
      () => useSummaryLineLineAttributesText(line as CheckoutLineFragment),
      {
        wrapper: getMockProviders(),
      }
    );

    expect(hook.current).toEqual("");
  });
});

describe("isCheckoutLine", () => {
  it("should return true for checkout line", () => {
    const line = checkout.lines[0];
    expect(isCheckoutLine(line as CheckoutLineFragment)).toEqual(true);
  });
});
