import {
  createEventUniqueKey,
  getSaleorAmountFromAdyen,
  getAdyenAmountFromSaleor,
} from "@/checkout-app/backend/payments/providers/adyen/utils";
import { TransactionEventFragment } from "@/checkout-app/graphql";

describe("@/checkout-app/backend/payments/providers/adyen/utils", () => {
  describe("createEventUniqueKey", () => {
    it("creates the same key for single event", () => {
      const event: TransactionEventFragment = {
        reference: "ref123",
        name: "event",
      };

      const key1 = createEventUniqueKey(event);
      const key2 = createEventUniqueKey(event);

      expect(key1).toEqual(key2);
    });

    it("creates different keys for different events", () => {
      const event1: TransactionEventFragment = {
        reference: "ref123",
        name: "event1",
      };
      const event2: TransactionEventFragment = {
        reference: "ref123",
        name: "event2",
      };

      const key1 = createEventUniqueKey(event1);
      const key2 = createEventUniqueKey(event2);

      expect(key1).not.toEqual(key2);
    });
  });

  describe("getSaleorAmountFromAdyen", () => {
    it("parses integer into float value", () => {
      expect(getSaleorAmountFromAdyen(1922)).toBe(19.22);
      expect(getSaleorAmountFromAdyen(1000)).toBe(10);
      expect(getSaleorAmountFromAdyen(837)).toBe(8.37);
    });
  });

  describe("getAdyenAmountFromSaleor", () => {
    it("parses float into integer value", () => {
      expect(getAdyenAmountFromSaleor(19.22)).toBe(1922);
      expect(getAdyenAmountFromSaleor(10)).toBe(1000);
      expect(getAdyenAmountFromSaleor(8.37)).toBe(837);
    });
  });
});
