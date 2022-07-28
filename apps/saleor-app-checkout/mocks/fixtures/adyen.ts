import { adyenHmacValidator } from "@/saleor-app-checkout/backend/payments/providers/adyen/validator";
import { Types } from "@adyen/api-library";
import { testingVars } from "../consts";

export const getPaymentRequest = (hmac?: string | null) => {
  const notificationItem = {
    additionalData: {
      authCode: "085117",
      avsResult: "4 AVS not supported for this card type",
      paymentLinkId: "PLEBC2E2F868C9BE80",
      cardSummary: "0004",
      authorisationMid: "50",
      "checkout.cardAddedBrand": "mc",
      hmacSignature: undefined as string | undefined,
      // hmacSignature: "qOB9lYiUMCMsJKzCOBQYu3f8pO5FZCd1KTcg+WWivvk=" as
      //   | undefined
      //   | string,
      acquirerAccountCode: "TestPmmAcquirerAccount",
      cvcResult: "1 Matches",
      expiryDate: "03/2030",
      "threeds2.cardEnrolled": "false",
      "metadata.orderId":
        "T3JkZXI6MGQ4NDRiZDMtYTA5YS00NzUyLWE0ODktYzFlMzM2Y2I4ZjU4",
    },
    amount: { currency: "USD", value: 4292 },
    eventCode: "AUTHORISATION",
    eventDate: "2022-07-28T14:08:36+02:00",
    merchantAccountCode: "SaleorECOM",
    merchantReference: "3394",
    operations: ["CANCEL", "CAPTURE", "REFUND"],
    paymentMethod: "mc",
    pspReference: "LD65H2FVNXSKGK82",
    reason: "085117:0004:03/2030",
    success: "true",
  } as unknown as Types.notification.NotificationRequestItem;

  const getResponse = (item: Types.notification.NotificationRequestItem) => ({
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
      hmacSignature: adyenHmacValidator.calculateHmac(
        notificationItem,
        testingVars.adyenHmac
      ),
    },
  });
};
