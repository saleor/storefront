import { CardContent, Typography } from "@material-ui/core";
import { PaymentProviderID, PaymentProviderSettings } from "checkout-common";
import VerticalSpacer from "@/saleor-app-checkout/frontend/components/elements/VerticalSpacer";
import { FormattedMessage } from "react-intl";
import { useStyles } from "./styles";
import { Controller, Control, FieldValues, useFormContext } from "react-hook-form";
import { messages } from "./messages";
import Setting from "@/saleor-app-checkout/frontend/components/elements/Setting";
import Skeleton from "@material-ui/lab/Skeleton";
import { Button } from "@saleor/macaw-ui";

interface PaymentProviderDetailsSettingsProps {
  settings: PaymentProviderSettings<PaymentProviderID>[];
  showHeader: boolean;
  description?: string;
  loading?: boolean;
  formControl?: Control<FieldValues, any>;
}

const PaymentProviderDetailsSettings: React.FC<PaymentProviderDetailsSettingsProps> = ({
  settings,
  showHeader,
  description,
  loading = false,
  formControl,
}) => {
  const classes = useStyles();
  const { resetField, setValue } = useFormContext();

  return (
    <CardContent>
      {showHeader && (
        <>
          <Typography variant="body1">
            <FormattedMessage {...messages.paymentProviderSettings} />
          </Typography>
          <VerticalSpacer />
        </>
      )}
      <div className={classes.settings}>
        {description && (
          <>
            <Typography variant="body2" className={classes.settingsDescription}>
              {description}
            </Typography>
            <VerticalSpacer />
          </>
        )}
        {loading ? (
          <Skeleton className={classes.skeleton} />
        ) : (
          settings.map(({ id, type, label, value, encrypt }) => (
            <Controller
              key={id}
              name={id}
              control={formControl}
              defaultValue={value}
              render={({ field, fieldState }) => (
                <div className={classes.formLine}>
                  <Setting
                    name={field.name}
                    type={type}
                    label={label}
                    value={field.value}
                    onChange={field.onChange}
                    defaultValue={value}
                    clearValue={() => setValue(field.name, "")}
                    resetValue={() => resetField(field.name)}
                    onBlur={field.onBlur}
                    encrypted={encrypt}
                  />
                  {fieldState.isDirty && (
                    <Button variant="tertiary" onClick={() => resetField(field.name)}>
                      Reset
                    </Button>
                  )}
                </div>
              )}
            />
          ))
        )}
      </div>
    </CardContent>
  );
};
export default PaymentProviderDetailsSettings;
