import {
  createEventUniqueKey,
  getTransactionAmountFromAdyen,
  TransactionAmounts,
  nonNegative,
} from "@/saleor-app-checkout/backend/payments/providers/adyen/utils";

import {
  getSaleorAmountFromInteger,
  getIntegerAmountFromSaleor,
} from "@/saleor-app-checkout/backend/payments/utils";
import { TransactionEventFragment, TransactionFragment } from "@/saleor-app-checkout/graphql";
import { prepareSaleorTransaction } from "@/saleor-app-checkout/mocks/fixtures/saleor";
import { Types } from "@adyen/api-library";

type NotificationRequestItem = Types.notification.NotificationRequestItem;
const EventCodeEnum = Types.notification.NotificationRequestItem.EventCodeEnum;
type EventCodeEnum = Types.notification.NotificationRequestItem.EventCodeEnum;
const SuccessEnum = Types.notification.NotificationRequestItem.SuccessEnum;

describe("nonNegative", () => {
  it("returns value if more than 0", () => {
    expect(nonNegative(10)).toBe(10);
    expect(nonNegative(10.21)).toBe(10.21);
  });

  it("returns 0 if value is less than 0", () => {
    expect(nonNegative(-1)).toBe(0);
    expect(nonNegative(-21.11)).toBe(0);
    expect(nonNegative(-0.21)).toBe(0);
    expect(nonNegative(-0)).toBe(0);
  });
});

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

describe("getSaleorAmountFromInteger", () => {
  it("parses integer into float value", () => {
    expect(getSaleorAmountFromInteger(1922)).toBe(19.22);
    expect(getSaleorAmountFromInteger(1000)).toBe(10);
    expect(getSaleorAmountFromInteger(837)).toBe(8.37);
  });
});

describe("getIntegerAmountFromSaleor", () => {
  it("parses float into integer value", () => {
    expect(getIntegerAmountFromSaleor(19.22)).toBe(1922);
    expect(getIntegerAmountFromSaleor(10)).toBe(1000);
    expect(getIntegerAmountFromSaleor(8.37)).toBe(837);
  });
});

describe("getTransactionAmountFromAdyen", () => {
  const DEFAULT_CURRENCY = "EUR";
  const prepareAdyenNotification = (
    amount: number,
    eventCode: EventCodeEnum
  ): NotificationRequestItem => ({
    amount: {
      currency: DEFAULT_CURRENCY,
      value: amount,
    },
    eventCode,
    pspReference: "OPERATION ID",
    success: SuccessEnum.True,
    additionalData: {},
    eventDate: new Date().toString(),
    merchantReference: "ORDER",
    merchantAccountCode: "Saleor",
    reason: "reason",
    operations: [],
    paymentMethod: "visa",
    originalReference: "PAYMENT ID",
  });

  it("returns nothing when notification is failed", () => {
    const notification = {
      ...prepareAdyenNotification(12_00, EventCodeEnum.Authorisation),
      success: SuccessEnum.False,
    };

    const result = getTransactionAmountFromAdyen(notification, null);

    expect(result).toStrictEqual({});
  });

  it("returns nothing if payment is pending", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Pending);
    const result = getTransactionAmountFromAdyen(notification, null);

    expect(result).toStrictEqual({});
  });

  it("throws an error if amount is missing", () => {
    const notification = {
      ...prepareAdyenNotification(12_00, EventCodeEnum.Authorisation),
      amount: undefined,
    } as Omit<Types.notification.NotificationRequestItem, "amount">;

    expect(() => {
      return getTransactionAmountFromAdyen(
        // @ts-expect-error We check for runtime errors that TypeScript will complain about
        notification,
        null
      );
    }).toThrow();
  });

  it("throws an error if transaction and notification currencies don't match", () => {
    const notification: NotificationRequestItem = {
      ...prepareAdyenNotification(12_00, EventCodeEnum.Capture),
      amount: {
        currency: "PLN",
        value: 12_00,
      },
    };

    const transaction: TransactionFragment = prepareSaleorTransaction("authorized", 12.0, "EUR");

    expect(() => {
      return getTransactionAmountFromAdyen(notification, transaction);
    }).toThrow();
  });

  it("returns amounts when new transaction was authorized", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Authorisation);
    const result = getTransactionAmountFromAdyen(notification, null);

    expect(result).toStrictEqual<TransactionAmounts>({
      amountAuthorized: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when new transaction was captured", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Capture);
    const result = getTransactionAmountFromAdyen(notification, null);

    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountAuthorized: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when existing transaction was captured", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Capture);
    const transaction = prepareSaleorTransaction("authorized", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountAuthorized: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when existing transaction was partially captured", () => {
    const notification = prepareAdyenNotification(10_00, EventCodeEnum.Capture);
    const transaction = prepareSaleorTransaction("authorized", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 10.0,
        currency: DEFAULT_CURRENCY,
      },
      amountAuthorized: {
        amount: 2.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction was cancelled", () => {
    // amount from notification doesn't matter - it has to be always fully voided (all or nothing)
    const notification = prepareAdyenNotification(0, EventCodeEnum.Cancellation);
    const transaction = prepareSaleorTransaction("authorized", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountVoided: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountAuthorized: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction capture failed", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.CaptureFailed);
    const transaction = prepareSaleorTransaction("charged", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
      amountAuthorized: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction was fully refunded", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Refund);
    const transaction = prepareSaleorTransaction("charged", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction was partialy refunded", () => {
    const notification = prepareAdyenNotification(10_00, EventCodeEnum.Refund);
    const transaction = prepareSaleorTransaction("charged", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 2.0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 10.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction was chargebacked", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.Chargeback);
    const transaction = prepareSaleorTransaction("charged", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction refund failed", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.RefundFailed);
    const transaction = prepareSaleorTransaction("refunded", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction partial refund fails", () => {
    const notification = prepareAdyenNotification(10_00, EventCodeEnum.RefundFailed);
    const transaction: TransactionFragment = {
      ...prepareSaleorTransaction("refunded", 10.0, DEFAULT_CURRENCY),
      ...prepareSaleorTransaction("charged", 2.0, DEFAULT_CURRENCY),
    };

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction chargeback was reversed", () => {
    const notification = prepareAdyenNotification(12_00, EventCodeEnum.ChargebackReversed);
    const transaction = prepareSaleorTransaction("refunded", 12.0, DEFAULT_CURRENCY);

    const result = getTransactionAmountFromAdyen(notification, transaction);
    expect(result).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });

  it("returns amounts when transaction was canceled or refunded (unspecified)", () => {
    type NotificationWithData = NotificationRequestItem & {
      additionalData: { [key: string]: any };
    };
    const notificationRefund: NotificationWithData = {
      ...prepareAdyenNotification(12_00, EventCodeEnum.CancelOrRefund),
      additionalData: {
        "modification.action": "refund",
      },
    };
    const transactionRefund = prepareSaleorTransaction("charged", 12.0, DEFAULT_CURRENCY);
    const resultRefund = getTransactionAmountFromAdyen(notificationRefund, transactionRefund);

    expect(resultRefund).toStrictEqual<TransactionAmounts>({
      amountCharged: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
      amountRefunded: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });

    const notificationCancel: NotificationWithData = {
      ...prepareAdyenNotification(0, EventCodeEnum.CancelOrRefund),
      additionalData: {
        "modification.action": "cancel",
      },
    };
    const transactionCancel = prepareSaleorTransaction("authorized", 12.0, DEFAULT_CURRENCY);
    const resultCancel = getTransactionAmountFromAdyen(notificationCancel, transactionCancel);
    expect(resultCancel).toStrictEqual<TransactionAmounts>({
      amountAuthorized: {
        amount: 0,
        currency: DEFAULT_CURRENCY,
      },
      amountVoided: {
        amount: 12.0,
        currency: DEFAULT_CURRENCY,
      },
    });
  });
});
