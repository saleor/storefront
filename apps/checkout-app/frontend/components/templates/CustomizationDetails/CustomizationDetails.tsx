import AppNavigation from "@/checkout-app/frontend/components/elements/AppNavigation";
import AppSavebar from "@/checkout-app/frontend/components/elements/AppSavebar";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import {
  OffsettedList,
  OffsettedListBody,
  ConfirmButtonTransitionState,
} from "@saleor/macaw-ui";
import {
  Customization,
  CustomizationID,
  PublicMetafieldID,
} from "types/common";
import { CustomizationSettingsValues } from "types/api";
import { useStyles } from "./styles";
import { FormattedMessage, useIntl } from "react-intl";
import { useForm, Controller } from "react-hook-form";
import { messages } from "./messages";
import Setting from "@/checkout-app/frontend/components/elements/Setting";
import {
  flattenSettingId,
  unflattenSettings,
  unflattenValue,
} from "@/checkout-app/frontend/utils";
import Skeleton from "@material-ui/lab/Skeleton";
import { MetadataErrorFragment } from "@/checkout-app/graphql";
import { getMetadataErrorMessage } from "@/checkout-app/frontend/misc/errors";
import ErrorAlert from "../../elements/ErrorAlert";
import CheckoutPreviewFrame from "../../elements/CheckoutPreviewFrame";
import { isValidHttpUrl, useSettingsFromValues } from "./data";
import { useState } from "react";
import { debounce } from "lodash-es";

interface CustomizationDetailsProps {
  options: Customization<CustomizationID>[];
  checkoutUrl?: string;
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors?: Partial<MetadataErrorFragment>[];
  onCancel: () => void;
  onSubmit: (data: CustomizationSettingsValues, checkoutUrl?: string) => void;
}

const CustomizationDetails: React.FC<CustomizationDetailsProps> = ({
  options,
  checkoutUrl,
  loading,
  saveButtonBarState,
  errors,
  onCancel,
  onSubmit,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const {
    control,
    handleSubmit: handleSubmitForm,
    formState,
    watch,
  } = useForm();

  const previewSettings = useSettingsFromValues(options, watch);
  const [previewUrl, setPreviewUrl] = useState(checkoutUrl);

  const handleSubmit = (flattenedValues: Record<string, string>) => {
    onSubmit(
      unflattenSettings(
        "customizations",
        flattenedValues,
        options
      ) as CustomizationSettingsValues,
      unflattenValue("customizationsCheckoutUrl", flattenedValues)
    );
  };

  return (
    <form>
      <AppNavigation />
      <div className={classes.root}>
        <OffsettedList gridTemplate={["1fr"]} className={classes.optionList}>
          <OffsettedListBody>
            {options.map((option, optionIdx) => (
              <Accordion
                key={option.id}
                className={classes.option}
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.optionExpander}
                >
                  <Typography variant="body1">{option.label}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.optionDetails}>
                  <div className={classes.optionDetailsContent}>
                    {loading ? (
                      <Skeleton className={classes.optionSkeleton} />
                    ) : (
                      option.settings?.map(({ id, type, label, value }) => (
                        <Controller
                          key={id}
                          name={flattenSettingId(
                            "customizations",
                            optionIdx,
                            id
                          )}
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
                      ))
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </OffsettedListBody>
        </OffsettedList>
        <div className={classes.design}>
          <ErrorAlert
            errors={errors}
            getErrorMessage={(error, intl) =>
              error.code
                ? getMetadataErrorMessage(error.code, intl)
                : error.message
            }
          />
          <Typography variant="subtitle1">
            <FormattedMessage {...messages.customizationPreview} />
          </Typography>
          <div className={classes.designPreview}>
            {loading ? (
              <Skeleton className={classes.designSkeleton} />
            ) : (
              <>
                <Controller
                  name={
                    "customizationsCheckoutUrl" as PublicMetafieldID[number]
                  }
                  control={control}
                  defaultValue={checkoutUrl}
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      label={intl.formatMessage(messages.checkoutUrl)}
                      className={classes.designUrlInput}
                      onChange={(event) => {
                        field.onChange(event);
                        debounce(
                          () => setPreviewUrl(event.target.value),
                          1000
                        )();
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {previewUrl && isValidHttpUrl(previewUrl) ? (
                  <CheckoutPreviewFrame
                    checkoutUrl={previewUrl}
                    settings={previewSettings}
                    className={classes.designPreviewFrame}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    className={classes.designNoPreview}
                  >
                    <FormattedMessage {...messages.noCheckoutUrl} />
                  </Typography>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AppSavebar
        disabled={loading || !formState.isDirty}
        state={saveButtonBarState}
        onCancel={onCancel}
        onSubmit={handleSubmitForm(handleSubmit)}
      />
    </form>
  );
};
export default CustomizationDetails;
