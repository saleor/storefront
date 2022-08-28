import { Money } from "@/checkout-storefront/graphql";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils/money";

describe("getFormattedMoney", () => {
  it("should display proper string for formatted money", () => {
    const money: Money = {
      currency: "GBP",
      amount: 12.4,
    };

    expect(getFormattedMoney(money)).toEqual("£12.40");
  });

  it("should return empty string for undefined instead of money", () => {
    expect(getFormattedMoney(undefined)).toEqual("");
  });
});
