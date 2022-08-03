import { adyenHmacValidator } from "@/saleor-app-checkout/backend/payments/providers/adyen/validator";
import { Types } from "@adyen/api-library";
import { NotificationRequestItem as AdyenNotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem";
import { AdditionalData } from "@adyen/api-library/lib/src/typings/notification/additionalData";
import { testingVars } from "../consts";

declare class NotificationRequestItem extends AdyenNotificationRequestItem {
  "additionalData": AdditionalData & {
    [key: string]: string;
  };
}

const getNotificationWithHmac =
  (notificationItem: NotificationRequestItem) => (hmac?: string | null) => {
    const getResponse = (item: NotificationRequestItem) => ({
      live: "false",
      notificationItems: [
        {
          NotificationRequestItem: item,
        },
      ],
    });

    if (hmac === null) {
      return getResponse(notificationItem);
    }

    if (typeof hmac === "string") {
      return getResponse({
        ...notificationItem,
        additionalData: {
          ...notificationItem.additionalData,
          hmacSignature: hmac,
        },
      });
    }

    return getResponse({
      ...notificationItem,
      additionalData: {
        ...notificationItem.additionalData,
        hmacSignature: adyenHmacValidator.calculateHmac(notificationItem, testingVars.adyenHmac),
      },
    });
  };

export const ADYEN_ORDER_ID = "T3JkZXI6MGQ4NDRiZDMtYTA5YS00NzUyLWE0ODktYzFlMzM2Y2I4ZjU4";
export const ADYEN_ORIGINAL_REFERENCE = "LD65H2FVNXSKGK82";
export const ADYEN_TRANSACTION_AMOUNT = 4292;
export const ADYEN_TRANSACTION_CURRENCY = "USD";

const paymentRequest: NotificationRequestItem = {
  additionalData: {
    authCode: "085117",
    avsResult: "4 AVS not supported for this card type",
    paymentLinkId: "PLEBC2E2F868C9BE80",
    cardSummary: "0004",
    authorisationMid: "50",
    "checkout.cardAddedBrand": "mc",
    acquirerAccountCode: "TestPmmAcquirerAccount",
    cvcResult: "1 Matches",
    expiryDate: "03/2030",
    "threeds2.cardEnrolled": "false",
    "metadata.orderId": ADYEN_ORDER_ID,
  },
  amount: { currency: ADYEN_TRANSACTION_CURRENCY, value: ADYEN_TRANSACTION_AMOUNT },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Authorisation,
  eventDate: "2022-07-28T14:08:36+02:00",
  merchantAccountCode: "SaleorECOM",
  merchantReference: "3394",
  operations: [
    "CANCEL",
    "CAPTURE",
  ] as unknown as Array<Types.notification.NotificationRequestItem.OperationsEnum>,
  paymentMethod: "mc",
  pspReference: ADYEN_ORIGINAL_REFERENCE,
  reason: "085117:0004:03/2030",
  success: AdyenNotificationRequestItem.SuccessEnum.True,
};
export const getPaymentRequest = getNotificationWithHmac(paymentRequest);

const paymentCapture: NotificationRequestItem = {
  ...paymentRequest,
  additionalData: {
    bookingDate: "2022-07-28T16:17:47Z",
    paymentLinkId: "PLEBC2E2F868C9BE80",
    "metadata.orderId": ADYEN_ORDER_ID,
  },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Capture,
  eventDate: "2022-07-28T16:17:01+02:00",
  originalReference: ADYEN_ORIGINAL_REFERENCE,
  pspReference: "NP5DFGQGJRWZNN82",
  operations: [
    "REFUND",
  ] as unknown as Array<Types.notification.NotificationRequestItem.OperationsEnum>,
  reason: "",
};
export const getPaymentCapture = getNotificationWithHmac(paymentCapture);

const firstPaymentCapture: NotificationRequestItem = {
  ...paymentCapture,
  originalReference: undefined,
  pspReference: ADYEN_ORIGINAL_REFERENCE,
};
export const getFirstPaymentCapture = getNotificationWithHmac(firstPaymentCapture);

const paymentRefund: NotificationRequestItem = {
  ...paymentRequest,
  additionalData: {
    bookingDate: "2022-07-28T16:17:47Z",
    paymentLinkId: "PLEBC2E2F868C9BE80",
    "metadata.orderId": ADYEN_ORDER_ID,
  },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Refund,
  eventDate: "2022-07-28T16:17:01+02:00",
  originalReference: ADYEN_ORIGINAL_REFERENCE,
  pspReference: "NP5DFGQGJRWZNN82",
  operations: [],
  reason: "Item returned",
};
export const getPaymentRefund = getNotificationWithHmac(paymentRefund);
