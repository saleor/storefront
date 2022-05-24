import PaymentProviderDetails from "frontend/components/templates/PaymentProviderDetails";
import { PaymentProviderSettingsValues } from "types/api";
import { useRouter } from "next/router";
import { getCommonErrors } from "@/frontend/utils";
import { usePaymentProviderSettings } from "@/frontend/data";
import ErrorDetails from "@/frontend/components/templates/ErrorDetails";
import { useIntl } from "react-intl";
import { notFoundMessages } from "@/frontend/misc/errorMessages";
import { useGetPaymentProviderSettings } from "@/frontend/hooks/useGetPaymentProviderSettings";
import { useSetPaymentProviderSettings } from "@/frontend/hooks/useSetPaymentProviderSettings";

const PaymentProvider = () => {
  const router = useRouter();
  const { paymentProviderId, channelId } = router.query;
  const intl = useIntl();

  const getPaymentProviderSettings = useGetPaymentProviderSettings();
  const [setPaymentProviderSettings, setPaymentProviderSettingsRequest] =
    useSetPaymentProviderSettings();

  const paymentProviders = usePaymentProviderSettings(
    getPaymentProviderSettings.data
  );

  const paymentProvider = paymentProviders.find(
    (paymentMethod) => paymentMethod.id === paymentProviderId
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: PaymentProviderSettingsValues<"unencrypted">) => {
    setPaymentProviderSettingsRequest(data);
  };

  const errors = [
    ...getCommonErrors(getPaymentProviderSettings.error),
    ...getCommonErrors(setPaymentProviderSettings.error),
  ];

  if (!paymentProvider) {
    return (
      <ErrorDetails
        error={intl.formatMessage(notFoundMessages.paymentProviderNotFound)}
      />
    );
  }

  return (
    <PaymentProviderDetails
      selectedPaymentProvider={paymentProvider}
      channelId={channelId?.toString()}
      saveButtonBarState="default"
      loading={
        getPaymentProviderSettings.loading || setPaymentProviderSettings.loading
      }
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default PaymentProvider;
