import { useRouter } from "next/router";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Item, PaymentProvider, PaymentProviderID } from "types/common";
import { paymentProviders } from "consts";
import VerticalSpacer from "@frontend/components/elements/VerticalSpacer";
import { channelListPath, channelPath, paymentProviderPath } from "routes";
import { FormattedMessage, useIntl } from "react-intl";
import { useStyles } from "./styles";
import { useForm, Controller } from "react-hook-form";
import { messages } from "./messages";
import { sectionMessages } from "@frontend/misc/commonMessages";
import AppLayout from "@frontend/components/elements/AppLayout";
import AppSavebar from "@frontend/components/elements/AppSavebar";
import Setting from "@frontend/components/elements/Setting";
import { PaymentProviderSettingsValues } from "types/api";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Skeleton from "@material-ui/lab/Skeleton";
import { getFormDefaultValues } from "./data";
import { useEffect } from "react";

interface PaymentProviderDetailsProps {
  selectedPaymentProvider: PaymentProvider<PaymentProviderID>;
  channelId?: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: PaymentProviderSettingsValues) => void;
}

const PaymentProviderDetails: React.FC<PaymentProviderDetailsProps> = ({
  selectedPaymentProvider,
  channelId,
  saveButtonBarState,
  loading,
  onCancel,
  onSubmit,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const classes = useStyles();
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
    } as PaymentProviderSettingsValues);
  };

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
        <Card>
          <CardContent>
            <Typography variant="body1">
              <FormattedMessage {...messages.paymentProviderSettings} />
            </Typography>
            <VerticalSpacer />
            <div className={classes.settings}>
              {selectedPaymentProvider.settings.map(
                ({ id, type, label, value }) =>
                  loading ? (
                    <Skeleton key={id} />
                  ) : (
                    <Controller
                      key={id}
                      name={id}
                      control={control}
                      defaultValue={value}
                      render={({ field }) => (
                        <Setting
                          name={field.name}
                          type={type}
                          label={label}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  )
              )}
            </div>
          </CardContent>
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
