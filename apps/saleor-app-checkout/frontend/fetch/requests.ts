import { PaymentProviderSettingsValues } from "@/saleor-app-checkout/types/api";
import { FetchResponse } from "../hooks/useFetch";
import { getAuthHeaders } from "../misc/auth";

export interface PaymentProviderSettingsResult {
  data: PaymentProviderSettingsValues<"unencrypted">;
}

export const requestGetPaymentProviderSettings = ({
  saleorApiHost,
}: {
  saleorApiHost: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

export const requestSetPaymentProviderSettings = ({
  saleorApiHost,
  ...data
}: PaymentProviderSettingsValues<"unencrypted"> & {
  saleorApiHost: string;
}): FetchResponse<PaymentProviderSettingsResult> =>
  fetch(
    `/api/set-payment-provider-settings/` + `?` + new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );
