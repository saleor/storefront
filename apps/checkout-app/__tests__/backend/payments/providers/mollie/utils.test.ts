import { parseAmountToString } from "@/checkout-app/backend/payments/providers/mollie/utils";

describe("@/checkout-app/backend/payments/providers/mollie/utils", () => {
  describe("parseAmountToString", () => {
    it("parses integer values to string", () => {
      expect(parseAmountToString(10)).toBe("10.00");
      expect(parseAmountToString(7)).toBe("7.00");
      expect(parseAmountToString(0)).toBe("0.00");
    });

    it("parses float values to string", () => {
      expect(parseAmountToString(10.11)).toBe("10.11");
      expect(parseAmountToString(8.37)).toBe("8.37");
      expect(parseAmountToString(0.021)).toBe("0.02");
    });

    it("parses negative values to string", () => {
      expect(parseAmountToString(-10)).toBe("-10.00");
      expect(parseAmountToString(-8.37)).toBe("-8.37");
      expect(parseAmountToString(-13.123)).toBe("-13.12");
    });
  });
});
