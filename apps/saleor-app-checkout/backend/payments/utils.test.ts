import { getIntegerAmountFromSaleor, getSaleorAmountFromInteger } from "./utils";
import fc from "fast-check";

describe("payments/utils", () => {
  it("getIntegerAmountFromSaleor should convert dollars to cents", () => {
    expect(getIntegerAmountFromSaleor(123.42)).toEqual(12342);
    expect(getIntegerAmountFromSaleor(19.22)).toBe(1922);
    expect(getIntegerAmountFromSaleor(10)).toBe(1000);
    expect(getIntegerAmountFromSaleor(8.37)).toBe(837);
  });

  it("getSaleorAmountFromInteger should convert cents to dollars", () => {
    expect(getSaleorAmountFromInteger(934512)).toEqual(9345.12);
    expect(getSaleorAmountFromInteger(1922)).toBe(19.22);
    expect(getSaleorAmountFromInteger(1000)).toBe(10);
    expect(getSaleorAmountFromInteger(837)).toBe(8.37);
  });

  it("should be idempotent when calling getIntegerAmountFromSaleor on getSaleorAmountFromInteger", () => {
    return fc.assert(
      fc.property(
        fc.integer(),
        (value) => value === getIntegerAmountFromSaleor(getSaleorAmountFromInteger(value))
      )
    );
  });

  it("should be idempotent when calling getSaleorAmountFromInteger on getIntegerAmountFromSaleor", () => {
    return fc.assert(
      fc.property(
        fc.integer().map((cents) => cents / 100),
        (value) => value === getSaleorAmountFromInteger(getIntegerAmountFromSaleor(value))
      )
    );
  });
});
