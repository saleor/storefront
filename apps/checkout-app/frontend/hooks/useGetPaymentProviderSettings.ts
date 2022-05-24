import { useEffect } from "react";
import { CombinedError } from "urql";
import { requestGetPaymentProviderSettings } from "../fetch";
import { useAuthData } from "./useAuthData";
import { useFetch, UseFetchOptionalProps } from "./useFetch";
import { usePrivateSettings } from "./usePrivateSettings";

export const useGetPaymentProviderSettings = <TArgs>(
  optionalProps?: UseFetchOptionalProps<TArgs>
) => {
  const { isAuthorized } = useAuthData();
  const { privateSettings, setPrivateSettings } = usePrivateSettings();

  const [{ data, loading, error }] = useFetch(
    requestGetPaymentProviderSettings,
    {
      skip: !isAuthorized,
      ...optionalProps,
    }
  );

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
  }, [data?.data]);

  return {
    loading,
    error: error as Partial<CombinedError>,
    data: privateSettings.paymentProviders,
  };
};
