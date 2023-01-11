import { getPaymentMethods } from "../fetch";
import { useAppConfig } from "../providers/AppConfigProvider";
import {
  getParsedPaymentMethods,
  getParsedPaymentProviders,
} from "../sections/PaymentSection/utils";
import { useCheckout } from "./useCheckout";
import { useFetch } from "./useFetch/useFetch";

export const useFetchPaymentMethods = () => {
  const {
    checkout: {
      channel: { id: channelId },
    },
  } = useCheckout();

  const {
    env: { checkoutApiUrl },
    saleorApiUrl,
  } = useAppConfig();

  const [{ data: activePaymentProvidersByChannel, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl, saleorApiUrl },
    skip: !channelId,
  });

  const availablePaymentMethods = getParsedPaymentMethods(activePaymentProvidersByChannel);
  const availablePaymentProviders = getParsedPaymentProviders(activePaymentProvidersByChannel);

  return {
    activePaymentProvidersByChannel,
    availablePaymentMethods,
    availablePaymentProviders,
    loading,
  };
};
