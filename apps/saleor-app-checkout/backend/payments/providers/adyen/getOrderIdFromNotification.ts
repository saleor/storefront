import { Client, CheckoutAPI, Types } from "@adyen/api-library";

export const getOrderIdFromNotification = async (
  notification: Types.notification.NotificationRequestItem,
  apiKey: string
) => {
  const { additionalData } = notification;
  if (!additionalData) {
    return;
  }
  return getOrderId(additionalData, apiKey);
};

export const getOrderId = async (
  additionalData: Types.notification.AdditionalData,
  apiKey: string
) => {
  const paymentLinkId = additionalData.paymentLinkId;
  if (!paymentLinkId) {
    // webhooks from drop-in don't have paymentLinkId
    return getOrderIdFromAdditionalData(additionalData);
  }

  const client = new Client({
    apiKey,
    environment: "TEST", // TODO: Choose environment dynamically in Dashboard
  });

  const checkout = new CheckoutAPI(client);

  try {
    const { metadata } = await checkout.getPaymentLinks(paymentLinkId);

    return metadata?.orderId;
  } catch (e) {
    // INFO: checkout.getPaymentLinks method fails randomly
    // it's possible to get notification metadata directly from notification itself (undocumented)
    console.warn("checkout.getPaymentLinks failed");

    return getOrderIdFromAdditionalData(additionalData);
  }
};

export const getOrderIdFromAdditionalData = (
  additionalData: Types.notification.AdditionalData & {
    ["metadata.orderId"]?: string | null | undefined;
  }
) => {
  return "metadata.orderId" in additionalData ? additionalData["metadata.orderId"] : null;
};
