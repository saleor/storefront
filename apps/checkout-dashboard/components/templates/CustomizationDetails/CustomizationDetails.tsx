import AppNavigation from "@elements/AppNavigation";
import SettingList from "@elements/SettingList";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { OffsettedList, OffsettedListBody } from "@saleor/macaw-ui";
import { Customization, CustomizationID } from "types";
import { useStyles } from "./styles";
import { FormattedMessage } from "react-intl";
import { messages } from "./messages";

interface CustomizationDetailsProps {
  options: Customization<CustomizationID>[];
}

const CustomizationDetails: React.FC<CustomizationDetailsProps> = ({
  options,
}) => {
  const classes = useStyles();

  return (
    <>
      <AppNavigation />
      <div className={classes.root}>
        <OffsettedList gridTemplate={["1fr"]} className={classes.optionList}>
          <OffsettedListBody>
            {options.map((option) => (
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
                    <SettingList settings={option.settings} />
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
    </>
  );
};
export default CustomizationDetails;
