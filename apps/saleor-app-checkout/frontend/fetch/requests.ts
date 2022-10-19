import { PaymentProviderSettingsValues } from "@/saleor-app-checkout/types/api";
import { FetchResponse } from "../hooks/useFetch";
import { getAuthHeaders } from "../misc/auth";

export interface PaymentProviderSettingsResult {
  data: PaymentProviderSettingsValues<"unencrypted">;
}

export const requestGetPaymentProviderSettings = ({
  saleorApiUrl,
}: {
  saleorApiUrl: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

export const requestSetPaymentProviderSettings = ({
  saleorApiUrl,
  ...data
}: PaymentProviderSettingsValues<"unencrypted"> & {
  saleorApiUrl: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/set-payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );
