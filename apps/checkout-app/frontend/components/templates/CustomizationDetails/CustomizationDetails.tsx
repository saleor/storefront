import AppNavigation from "@frontend/components/elements/AppNavigation";
import AppSavebar from "@frontend/components/elements/AppSavebar";
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
import { UnknownSettingsValues } from "types/api";
import { useStyles } from "./styles";
import { FormattedMessage } from "react-intl";
import { useForm, Controller } from "react-hook-form";
import { messages } from "./messages";
import Setting from "@frontend/components/elements/Setting";
import { flattenSettingId, unflattenSettings } from "@frontend/utils";

interface CustomizationDetailsProps {
  options: Customization<CustomizationID>[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onCanel: () => void;
  onSubmit: (data: UnknownSettingsValues) => void;
}

const CustomizationDetails: React.FC<CustomizationDetailsProps> = ({
  options,
  disabled,
  saveButtonBarState,
  onCanel,
  onSubmit,
}) => {
  const classes = useStyles();
  const { control, handleSubmit: handleSubmitForm, formState } = useForm();

  const handleSubmit = (flattedSettings: Record<string, string>) => {
    onSubmit(unflattenSettings(flattedSettings, options));
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
                    {option.settings?.map(({ id, type, label, value }) => (
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
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </OffsettedListBody>
        </OffsettedList>
        <div className={classes.design}>
          <Typography variant="subtitle1">
            <FormattedMessage {...messages.customizationPreview} />
          </Typography>
          <div className={classes.designPreview}>Customization</div>
        </div>
      </div>
      <AppSavebar
        disabled={disabled || !formState.isDirty}
        state={saveButtonBarState}
        onCancel={onCanel}
        onSubmit={handleSubmitForm(handleSubmit)}
      />
    </form>
  );
};
export default CustomizationDetails;
