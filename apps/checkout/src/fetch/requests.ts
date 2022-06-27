import { FetchResponse } from "@/checkout/hooks/useFetch";
import { envVars } from "@/checkout/lib/utils";
import { AppConfig } from "@/checkout/providers/AppConfigProvider/types";
import { PayRequestBody } from "checkout-app/types/api/pay";
import { PaymentStatusResponse } from "checkout-app/types/api/payment-status";
import { PayResult } from "./types";
import { ChannelActivePaymentProvidersByChannel } from "checkout-app/types";

export const getPaymentMethods =
  (): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
    fetch(
      // TODO: Remove hardcoded channel name
      `${envVars.checkoutApiUrl}/active-payment-providers/Q2hhbm5lbDoyMjQz`
    );

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
