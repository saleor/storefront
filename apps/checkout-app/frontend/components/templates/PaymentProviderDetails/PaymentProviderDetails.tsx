import { useRouter } from "next/router";
import { Card, Divider } from "@material-ui/core";
import { Item, PaymentProvider, PaymentProviderID } from "types/common";
import { channelListPath, channelPath, paymentProviderPath } from "routes";
import { sectionMessages } from "@/frontend/misc/commonMessages";
import AppLayout from "@/frontend/components/elements/AppLayout";
import AppSavebar from "@/frontend/components/elements/AppSavebar";
import { PaymentProviderSettingsValues } from "types/api";
import { extractSettingsData, getFormDefaultValues } from "./data";
import { getMetadataErrorMessage } from "@/frontend/misc/errors";
import { MetadataErrorFragment } from "@/graphql";
import ErrorAlert from "../../elements/ErrorAlert";
import { usePaymentProviders } from "@/config/fields";
import PaymentProviderDetailsSettings from "./PaymentProviderDetailsSettings";
import { messages } from "./messages";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface PaymentProviderDetailsProps {
  selectedPaymentProvider: PaymentProvider<PaymentProviderID>;
  channelId?: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  loading: boolean;
  errors?: Partial<MetadataErrorFragment>[];
  onCancel: () => void;
  onSubmit: (data: PaymentProviderSettingsValues<"unencrypted">) => void;
}

const PaymentProviderDetails: React.FC<PaymentProviderDetailsProps> = ({
  selectedPaymentProvider,
  channelId,
  saveButtonBarState,
  loading,
  errors,
  onCancel,
  onSubmit,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const paymentProviders = usePaymentProviders();
  const {
    control,
    handleSubmit: handleSubmitForm,
    formState,
    reset: resetForm,
  } = useForm({
    shouldUnregister: true, // Legacy fields from different subpage using the same form might be still present, this should unregister them
  });

  useEffect(() => {
    resetForm(getFormDefaultValues(selectedPaymentProvider)); // Update values on subpage change as the same form is used
  }, [selectedPaymentProvider, resetForm]);

  const onBackClick = () => {
    if (channelId) {
      router.push({
        pathname: channelPath,
        query: {
          channelId: channelId,
        },
      });
    } else {
      router.push(channelListPath);
    }
  };

  const onPaymentProviderClick = (paymentProvider: Item) => {
    if (channelId) {
      router.push({
        pathname: paymentProviderPath,
        query: {
          paymentProviderId: paymentProvider.id,
          channelId,
        },
      });
    } else {
      router.push({
        pathname: paymentProviderPath,
        query: {
          paymentProviderId: paymentProvider.id,
        },
      });
    }
  };

  const handleSubmit = (flattedOptions: Record<string, string>) => {
    onSubmit({
      [selectedPaymentProvider.id]: flattedOptions,
    } as PaymentProviderSettingsValues<"unencrypted">);
  };

  const {
    encryptedSettings,
    publicSettings,
    hasEncryptedSettings,
    hasPublicSettings,
  } = extractSettingsData(selectedPaymentProvider);

  return (
    <form>
      <AppLayout
        title={intl.formatMessage(sectionMessages.settings)}
        onBackClick={onBackClick}
        items={paymentProviders}
        selectedItem={selectedPaymentProvider}
        loading={loading}
        onItemClick={onPaymentProviderClick}
      >
        <ErrorAlert
          errors={errors}
          getErrorMessage={(error, intl) =>
            error.code
              ? getMetadataErrorMessage(error.code, intl)
              : error.message
          }
        />
        <Card>
          {loading && (
            <PaymentProviderDetailsSettings
              settings={encryptedSettings}
              showHeader={true}
              loading={true}
            />
          )}
          {!loading && hasEncryptedSettings && (
            <PaymentProviderDetailsSettings
              settings={encryptedSettings}
              description={intl.formatMessage(messages.encryptedSettingNotice)}
              showHeader={true}
              formControl={control}
            />
          )}
          {!loading && hasPublicSettings && (
            <>
              {hasEncryptedSettings && <Divider />}
              <PaymentProviderDetailsSettings
                settings={publicSettings}
                description={intl.formatMessage(messages.publicSettingNotice)}
                showHeader={!hasEncryptedSettings}
                formControl={control}
              />
            </>
          )}
        </Card>
      </AppLayout>
      <AppSavebar
        disabled={loading || !formState.isDirty}
        state={saveButtonBarState}
        onCancel={onCancel}
        onSubmit={handleSubmitForm(handleSubmit)}
      />
    </form>
  );
};
export default PaymentProviderDetails;
