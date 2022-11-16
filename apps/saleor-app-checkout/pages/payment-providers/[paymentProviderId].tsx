import PaymentProviderDetails from "frontend/components/templates/PaymentProviderDetails";
import { PaymentProviderSettingsValues } from "types/api";
import { useRouter } from "next/router";
import { getCommonErrors } from "@/saleor-app-checkout/frontend/utils";
import { usePaymentProviderSettings } from "@/saleor-app-checkout/frontend/data";
import ErrorDetails from "@/saleor-app-checkout/frontend/components/templates/ErrorDetails";
import { useIntl } from "react-intl";
import { notFoundMessages } from "@/saleor-app-checkout/frontend/misc/errorMessages";
import { useGetPaymentProviderSettings } from "@/saleor-app-checkout/frontend/hooks/useGetPaymentProviderSettings";
import { useSetPaymentProviderSettings } from "@/saleor-app-checkout/frontend/hooks/useSetPaymentProviderSettings";
import { app } from "@/saleor-app-checkout/frontend/misc/app";

const PaymentProvider = () => {
  const router = useRouter();
  const { paymentProviderId, channelId } = router.query;
  const intl = useIntl();

  const getPaymentProviderSettings = useGetPaymentProviderSettings();
  const [setPaymentProviderSettings, setPaymentProviderSettingsRequest] =
    useSetPaymentProviderSettings();

  const paymentProviders = usePaymentProviderSettings(getPaymentProviderSettings.data);

  const domain = app?.getState().domain;
  if (!domain) {
    console.error(`Missing domain!`);
    return null;
  }
  const saleorApiUrl = `https://${domain}/graphql/`;

  const paymentProvider = paymentProviders.find(
    (paymentMethod) => paymentMethod.id === paymentProviderId
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: PaymentProviderSettingsValues<"unencrypted">) => {
    void setPaymentProviderSettingsRequest({ ...data, saleorApiUrl });
  };

  const errors = [
    ...getCommonErrors(getPaymentProviderSettings.error),
    ...getCommonErrors(setPaymentProviderSettings.error),
  ];

  if (!paymentProvider) {
    return <ErrorDetails error={intl.formatMessage(notFoundMessages.paymentProviderNotFound)} />;
  }

  return (
    <PaymentProviderDetails
      selectedPaymentProvider={paymentProvider}
      channelId={channelId?.toString()}
      saveButtonBarState="default"
      loading={getPaymentProviderSettings.loading || setPaymentProviderSettings.loading}
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default PaymentProvider;
