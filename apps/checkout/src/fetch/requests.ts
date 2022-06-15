import { FetchResponse } from "@/checkout/hooks/useFetch";
import { envVars } from "@/checkout/lib/utils";
import { AppConfig } from "@/checkout/providers/AppConfigProvider/types";
import { PayRequestBody } from "checkout-app/types/api/pay";
import { PaymentStatusResponse } from "checkout-app/types/api/payment-status";

export const getPaymentProviders = () =>
  fetch(`${envVars.checkoutApiUrl}/active-payment-providers/channel-1`);

export interface PayResult {
  orderId: string;
  data: {
    paymentUrl: string;
  };
}

export const pay = (body: PayRequestBody): FetchResponse<PayResult> =>
  fetch(`${envVars.checkoutApiUrl}/pay`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAppConfig = (): FetchResponse<AppConfig> =>
  fetch(`${envVars.checkoutApiUrl}/customization-settings`);

export const getOrderPaymentStatus = ({
  orderId,
}: {
  orderId: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(`${envVars.checkoutApiUrl}/payment-status/${orderId}`);
