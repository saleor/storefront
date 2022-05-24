import { envVars } from "@/constants";
import { PaymentProviderSettingsValues } from "@/types/api";
import { FetchResponse } from "../hooks/useFetch";
import { getAuthHeaders } from "../misc/auth";

export interface PaymentProviderSettingsResult {
  data: PaymentProviderSettingsValues<"unencrypted">;
}

export const requestGetPaymentProviderSettings =
  (): FetchResponse<PaymentProviderSettingsResult> =>
    fetch(`${envVars.appUrl}/api/payment-provider-settings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

export const requestSetPaymentProviderSettings = (
  data: PaymentProviderSettingsValues<"unencrypted">
): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(`${envVars.appUrl}/api/set-payment-provider-settings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
