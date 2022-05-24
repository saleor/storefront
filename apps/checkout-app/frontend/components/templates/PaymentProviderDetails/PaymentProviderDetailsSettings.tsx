import { CardContent, Typography } from "@material-ui/core";
import { PaymentProviderID, PaymentProviderSettings } from "types/common";
import VerticalSpacer from "@/frontend/components/elements/VerticalSpacer";
import { FormattedMessage } from "react-intl";
import { useStyles } from "./styles";
import { Controller, Control, FieldValues } from "react-hook-form";
import { messages } from "./messages";
import Setting from "@/frontend/components/elements/Setting";
import Skeleton from "@material-ui/lab/Skeleton";

interface PaymentProviderDetailsSettingsProps {
  settings: PaymentProviderSettings<PaymentProviderID>[];
  showHeader: boolean;
  description?: string;
  loading?: boolean;
  formControl?: Control<FieldValues, any>;
}

const PaymentProviderDetailsSettings: React.FC<
  PaymentProviderDetailsSettingsProps
> = ({ settings, showHeader, description, loading = false, formControl }) => {
  const classes = useStyles();

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
          settings.map(({ id, type, label, value }) => (
            <Controller
              key={id}
              name={id}
              control={formControl}
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
          ))
        )}
      </div>
    </CardContent>
  );
};
export default PaymentProviderDetailsSettings;
