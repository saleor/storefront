import {
  OffsettedList,
  OffsettedListBody,
  OffsettedListItem,
  OffsettedListItemCell,
  useOffsettedListWidths,
} from "@saleor/macaw-ui";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch,
  Typography,
} from "@material-ui/core";
import { ChannelPaymentOptions } from "types/api";
import { Channel } from "types/saleor";
import { paymentProviders } from "consts";
import { useStyles } from "./styles";
import { channelListPath, channelPath, paymentProviderPath } from "routes";
import { messages } from "./messages";
import AppLayout from "@elements/AppLayout";

interface ChannelDetailsProps {
  channelPaymentOptions?: ChannelPaymentOptions;
  channels?: Channel[];
}

const ChannelDetails: React.FC<ChannelDetailsProps> = ({
  channelPaymentOptions,
  channels,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const { actions } = useOffsettedListWidths();

  const onBackClick = () => {
    router.push(channelListPath);
  };

  const onSettingsClick = () => {
    router.push({
      pathname: paymentProviderPath,
      query: {
        paymentProviderId: paymentProviders[0].id,
        channelId: channelPaymentOptions?.channel.id,
      },
    });
  };

  const onChannelClick = (channel: Channel) => {
    router.push({
      pathname: channelPath,
      query: { channelId: channel.id },
    });
  };

  return (
    <AppLayout
      title={channelPaymentOptions?.channel.label}
      onBackClick={onBackClick}
      onSettingsClick={onSettingsClick}
      items={channels}
      selectedItem={channelPaymentOptions?.channel}
      onItemClick={onChannelClick}
    >
      <Typography variant="subtitle1">
        <FormattedMessage {...messages.selectPaymentMethods} />
      </Typography>
      {channelPaymentOptions?.paymentOptions.map((paymentOption) => (
        <Accordion
          key={paymentOption.method.id}
          className={classes.paymentOption}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.paymentOptionExpander}
          >
            <div className={classes.paymentOptionIcon}></div>
            <Typography variant="subtitle2">
              {paymentOption.method.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.paymentOptionDetails}>
            <OffsettedList gridTemplate={["1fr", actions(1)]}>
              <OffsettedListBody>
                {paymentOption.availableProviders.map((provider) => (
                  <OffsettedListItem
                    key={provider.id}
                    className={classes.paymentMethod}
                  >
                    <OffsettedListItemCell>
                      {provider.label}
                    </OffsettedListItemCell>
                    <OffsettedListItemCell padding="action">
                      <Switch
                        checked={
                          provider.id === paymentOption.activeProvider?.id
                        }
                      />
                    </OffsettedListItemCell>
                  </OffsettedListItem>
                ))}
              </OffsettedListBody>
            </OffsettedList>
          </AccordionDetails>
        </Accordion>
      ))}
    </AppLayout>
  );
};
export default ChannelDetails;
