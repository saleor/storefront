import { useEffect } from "react";
import { CombinedError } from "urql";
import { requestSetPaymentProviderSettings } from "../fetch";
import { app } from "../misc/app";
import { useFetch, UseFetchOptionalProps } from "./useFetch";
import { usePrivateSettings } from "./usePrivateSettings";

export const useSetPaymentProviderSettings = <TArgs>(
  optionalProps?: UseFetchOptionalProps<TArgs>
) => {
  const { privateSettings, setPrivateSettings } = usePrivateSettings();

  const saleorApiHost = app?.getState().domain;

  const [{ data, loading, error }, request] = useFetch(requestSetPaymentProviderSettings, {
    skip: true,
    ...optionalProps,
    args: {
      ...optionalProps?.args,
      saleorApiHost,
    },
  });

  useEffect(() => {
    if (data?.data) {
      setPrivateSettings({
        ...privateSettings,
        paymentProviders: {
          ...privateSettings.paymentProviders,
          ...data.data,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  return [
    {
      loading,
      error: error as Partial<CombinedError>,
      data: privateSettings.paymentProviders,
    },
    request,
  ] as const;
};
