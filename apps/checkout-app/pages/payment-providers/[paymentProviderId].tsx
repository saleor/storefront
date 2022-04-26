import PaymentProviderDetails from "frontend/components/templates/PaymentProviderDetails";
import { PaymentProviderSettingsValues } from "types/api";
import { useRouter } from "next/router";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import {
  usePrivateMetadataQuery,
  useUpdatePrivateMetadataMutation,
} from "@/graphql";
import {
  getCommonErrors,
  mapMetadataToSettings,
  mapSettingsToMetadata,
} from "@/frontend/utils";
import { getPaymentProviderSettings } from "@/frontend/data";
import ErrorDetails from "@/frontend/components/templates/ErrorDetails";
import { useIntl } from "react-intl";
import { notFoundMessages } from "@/frontend/misc/errorMessages";

const PaymentProvider = () => {
  const router = useRouter();
  const { paymentProviderId, channelId } = router.query;
  const intl = useIntl();

  const { appId, isAuthorized } = useAuthData();
  const [metadataQuery] = usePrivateMetadataQuery({
    variables: {
      id: appId,
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPrivateMetadata] =
    useUpdatePrivateMetadataMutation();

  const settingsValues = mapMetadataToSettings(
    metadataQuery.data?.app?.privateMetadata || []
  );
  const paymentProviders = getPaymentProviderSettings(
    settingsValues.paymentProviders
  );

  const paymentProvider = paymentProviders.find(
    (paymentMethod) => paymentMethod.id === paymentProviderId
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: PaymentProviderSettingsValues) => {
    const metadata = mapSettingsToMetadata({
      paymentProviders: {
        ...settingsValues.paymentProviders,
        ...data,
      },
    });

    setPrivateMetadata({
      id: appId,
      input: metadata,
    });
  };

  const errors = [
    ...(metadataMutation.data?.updatePrivateMetadata?.errors || []),
    ...getCommonErrors(metadataMutation.error),
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
      loading={metadataQuery.fetching || metadataMutation.fetching}
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default PaymentProvider;
