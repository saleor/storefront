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

export const getPaymentRequest = getNotificationWithHmac({
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
    "metadata.orderId": "T3JkZXI6MGQ4NDRiZDMtYTA5YS00NzUyLWE0ODktYzFlMzM2Y2I4ZjU4",
  },
  amount: { currency: "USD", value: 4292 },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Authorisation,
  eventDate: "2022-07-28T14:08:36+02:00",
  merchantAccountCode: "SaleorECOM",
  merchantReference: "3394",
  operations: [
    "CANCEL",
    "CAPTURE",
    "REFUND",
  ] as unknown as Array<Types.notification.NotificationRequestItem.OperationsEnum>,
  paymentMethod: "mc",
  pspReference: "LD65H2FVNXSKGK82",
  reason: "085117:0004:03/2030",
  success: AdyenNotificationRequestItem.SuccessEnum.True,
});

export const getPaymentCapture = getNotificationWithHmac({
  additionalData: {},
  amount: {
    currency: "USD",
    value: 4292,
  },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Capture,
  eventDate: "2022-07-28T16:17:01+02:00",
  merchantAccountCode: "SaleorECOM",
  merchantReference: "3394",
  originalReference: "LD65H2FVNXSKGK82",
  paymentMethod: "mc",
  pspReference: "NP5DFGQGJRWZNN82",
  reason: "",
  success: AdyenNotificationRequestItem.SuccessEnum.True,
});

export const getPaymentRefund = getNotificationWithHmac({
  additionalData: {
    bookingDate: "2022-07-28T16:17:47Z",
    paymentLinkId: "PLEBC2E2F868C9BE80",
    "metadata.orderId": "T3JkZXI6MGQ4NDRiZDMtYTA5YS00NzUyLWE0ODktYzFlMzM2Y2I4ZjU4",
  },
  amount: {
    currency: "USD",
    value: 4292,
  },
  eventCode: AdyenNotificationRequestItem.EventCodeEnum.Refund,
  eventDate: "2022-07-28T16:17:01+02:00",
  merchantAccountCode: "SaleorECOM",
  merchantReference: "3394",
  originalReference: "LD65H2FVNXSKGK82",
  paymentMethod: "mc",
  pspReference: "NP5DFGQGJRWZNN82",
  reason: "Item returned",
  success: AdyenNotificationRequestItem.SuccessEnum.True,
});
