import { createEventUniqueKey } from "@/saleor-app-checkout/backend/payments/providers/adyen/utils";
import { TransactionEventFragment } from "@/saleor-app-checkout/graphql";

describe("@/saleor-app-checkout/backend/payments/providers/adyen/utils", () => {
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
});
