import { getTransactionAmountGetter } from "@/saleor-app-checkout/backend/payments/utils";

describe("@/saleor-app-checkout/backend/payments/utils", () => {
  describe("getTransactionAmountGetter util", () => {
    it("returns correct authorized value", () => {
      const fn = getTransactionAmountGetter({
        charged: 0,
        authorized: 100,
        refunded: 0,
        voided: 0,
      });

      expect(fn("authorized")).toBe(100);
      expect(fn("charged")).toBe(0);
      expect(fn("refunded")).toBe(0);
      expect(fn("voided")).toBe(0);
    });

    it("returns correct authorized value when partially charged", () => {
      const fn = getTransactionAmountGetter({
        charged: 50,
        authorized: 100,
        refunded: 0,
        voided: 0,
      });

      expect(fn("authorized")).toBe(50);
      expect(fn("charged")).toBe(50);
      expect(fn("refunded")).toBe(0);
      expect(fn("voided")).toBe(0);
    });

    it("returns correct charged value", () => {
      const fn = getTransactionAmountGetter({
        charged: 100,
        authorized: 100,
        refunded: 0,
        voided: 0,
      });

      expect(fn("authorized")).toBe(0);
      expect(fn("charged")).toBe(100);
      expect(fn("refunded")).toBe(0);
      expect(fn("voided")).toBe(0);
    });

    it("returns correct charted value when refunded", () => {
      const fn = getTransactionAmountGetter({
        charged: 100,
        authorized: 100,
        refunded: 100,
        voided: 0,
      });

      expect(fn("authorized")).toBe(0);
      expect(fn("charged")).toBe(0);
      expect(fn("refunded")).toBe(100);
      expect(fn("voided")).toBe(0);
    });

    it("returns correct charged value when partialy refunded", () => {
      const fn = getTransactionAmountGetter({
        charged: 100,
        authorized: 100,
        refunded: 50,
        voided: 0,
      });

      expect(fn("authorized")).toBe(0);
      expect(fn("charged")).toBe(50);
      expect(fn("refunded")).toBe(50);
      expect(fn("voided")).toBe(0);
    });

    it("returns 0 for charged value if returned more than transaction", () => {
      const fn = getTransactionAmountGetter({
        charged: 100,
        authorized: 100,
        refunded: 200,
        voided: 0,
      });

      expect(fn("authorized")).toBe(0);
      expect(fn("charged")).toBe(0);
      expect(fn("refunded")).toBe(200);
      expect(fn("voided")).toBe(0);
    });

    it("handles problematic numbers", () => {
      const fn = getTransactionAmountGetter({
        charged: 0.2,
        authorized: 0.3,
        refunded: 0,
        voided: 0,
      });

      expect(fn("authorized")).toBe(0.1);
      expect(fn("charged")).toBe(0.2);
      expect(fn("refunded")).toBe(0);
      expect(fn("voided")).toBe(0);
    });
  });
});
