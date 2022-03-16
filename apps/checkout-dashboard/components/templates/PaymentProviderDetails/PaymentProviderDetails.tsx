import { useRouter } from "next/router";
import { Card, CardContent, Typography } from "@material-ui/core";
import { PaymentProvider, PaymentProviderID } from "types";
import { paymentProviders } from "consts";
import VerticalSpacer from "@elements/VerticalSpacer";
import { channelListPath, channelPath, paymentProviderPath } from "routes";
import { FormattedMessage, useIntl } from "react-intl";
import { useStyles } from "./styles";
import { useForm, Controller } from "react-hook-form";
import { messages } from "./messages";
import { sectionMessages } from "@misc/commonMessages";
import AppLayout from "@elements/AppLayout";
import AppSavebar from "@elements/AppSavebar";
import Setting from "@elements/Setting";
import { UnknownSettingsValues } from "types/api";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";

interface PaymentProviderDetailsProps {
  selectedPaymentProvider?: PaymentProvider<PaymentProviderID>;
  channelId?: string;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onCanel: () => void;
  onSubmit: (data: UnknownSettingsValues) => void;
}

const PaymentProviderDetails: React.FC<PaymentProviderDetailsProps> = ({
  selectedPaymentProvider,
  channelId,
  disabled,
  saveButtonBarState,
  onCanel,
  onSubmit,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const classes = useStyles();
  const {
    control,
    handleSubmit: handleSubmitForm,
    formState,
  } = useForm({
    shouldUnregister: true,
  });

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

  const onPaymentProviderClick = (
    paymentProvider: PaymentProvider<PaymentProviderID>
  ) => {
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
    });
  };

  return (
    <form>
      <AppLayout
        title={intl.formatMessage(sectionMessages.settings)}
        onBackClick={onBackClick}
        items={paymentProviders}
        selectedItem={selectedPaymentProvider}
        onItemClick={onPaymentProviderClick}
      >
        <Card>
          <CardContent>
            <Typography variant="body1">
              <FormattedMessage {...messages.paymentProviderSettings} />
            </Typography>
            <VerticalSpacer />
            <div className={classes.settings}>
              {selectedPaymentProvider?.settings?.map(
                ({ id, type, label, value }) => (
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
        disabled={disabled || !formState.isDirty}
        state={saveButtonBarState}
        onCancel={onCanel}
        onSubmit={handleSubmitForm(handleSubmit)}
      />
    </form>
  );
};
export default PaymentProviderDetails;
