import { getById } from "@/checkout-storefront/lib/utils";

describe("getById", () => {
  it("should allow filtering only matching elements", () => {
    const items = [
      { name: "one", id: "one" },
      { name: "two", id: "two" },
      { name: "three", id: "three" },
      { name: "four", id: "four" },
    ];

    expect(items.filter(getById("one"))).toEqual([items[0]]);
  });
});
