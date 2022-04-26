import AppNavigation from "@/frontend/components/elements/AppNavigation";
import AppSavebar from "@/frontend/components/elements/AppSavebar";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import {
  OffsettedList,
  OffsettedListBody,
  ConfirmButtonTransitionState,
} from "@saleor/macaw-ui";
import { Customization, CustomizationID } from "types/common";
import { CustomizationSettingsValues } from "types/api";
import { useStyles } from "./styles";
import { FormattedMessage } from "react-intl";
import { useForm, Controller } from "react-hook-form";
import { messages } from "./messages";
import Setting from "@/frontend/components/elements/Setting";
import { flattenSettingId, unflattenSettings } from "@/frontend/utils";
import Skeleton from "@material-ui/lab/Skeleton";
import { MetadataErrorFragment } from "@/graphql";
import { getMetadataErrorMessage } from "@/frontend/misc/errors";
import ErrorAlert from "../../elements/ErrorAlert";

interface CustomizationDetailsProps {
  options: Customization<CustomizationID>[];
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors?: Partial<MetadataErrorFragment>[];
  onCancel: () => void;
  onSubmit: (data: CustomizationSettingsValues) => void;
}

const CustomizationDetails: React.FC<CustomizationDetailsProps> = ({
  options,
  loading,
  saveButtonBarState,
  errors,
  onCancel,
  onSubmit,
}) => {
  const classes = useStyles();
  const { control, handleSubmit: handleSubmitForm, formState } = useForm();

  const handleSubmit = (flattenedSettings: Record<string, string>) => {
    onSubmit(
      unflattenSettings(
        flattenedSettings,
        options
      ) as CustomizationSettingsValues
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
                    {option.settings?.map(({ id, type, label, value }) =>
                      loading ? (
                        <Skeleton key={id} />
                      ) : (
                        <Controller
                          key={id}
                          name={flattenSettingId(optionIdx, id)}
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
          <div className={classes.designPreview}>Customization</div>
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
