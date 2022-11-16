import { useEffect } from "react";
import { CombinedError } from "urql";
import { requestGetPaymentProviderSettings } from "../fetch";
import { app } from "../misc/app";
import { useAuthData } from "./useAuthData";
import { useFetch, UseFetchOptionalProps } from "./useFetch";
import { usePrivateSettings } from "./usePrivateSettings";

export const useGetPaymentProviderSettings = <TArgs>(
  optionalProps?: UseFetchOptionalProps<TArgs>
) => {
  const { isAuthorized } = useAuthData();
  const { privateSettings, setPrivateSettings } = usePrivateSettings();

  const domain = app?.getState().domain;
  if (!domain) {
    console.error(`Missing domain!`);
  }
  const saleorApiUrl = domain ? `https://${domain}/graphql/` : "";

  const [{ data, loading, error }] = useFetch(requestGetPaymentProviderSettings, {
    skip: !isAuthorized,
    ...optionalProps,
    args: {
      ...optionalProps?.args,
      saleorApiUrl,
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

  return {
    loading,
    error: error as Partial<CombinedError>,
    data: privateSettings.paymentProviders,
  };
};
