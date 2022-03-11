import AppNavigation from "@elements/AppNavigation";
import {
  OffsettedList,
  OffsettedListBody,
  OffsettedListHeader,
  OffsettedListItem,
  OffsettedListItemCell,
} from "@saleor/macaw-ui";
import { Channel } from "api/saleor/types";
import { useRouter } from "next/router";
import { channelPath } from "routes";
import { useStyles } from "./styles";
import { FormattedMessage } from "react-intl";
import { messages } from "./messages";

interface ChannelListProps {
  channels?: Channel[];
}

const ChannelList: React.FC<ChannelListProps> = ({ channels }) => {
  const router = useRouter();
  const classes = useStyles();

  const onChannelClick = (channel: Channel) => {
    router.push({
      pathname: channelPath,
      query: { channelId: channel.id },
    });
  };

  return (
    <>
      <AppNavigation />
      <OffsettedList gridTemplate={["1fr"]}>
        <OffsettedListHeader>
          <OffsettedListItem>
            <OffsettedListItemCell>
              <FormattedMessage {...messages.channelName} />
            </OffsettedListItemCell>
          </OffsettedListItem>
        </OffsettedListHeader>
        <OffsettedListBody>
          {channels?.map((channel) => (
            <OffsettedListItem
              key={channel.id}
              className={classes.listItem}
              onClick={() => onChannelClick(channel)}
            >
              <OffsettedListItemCell>{channel.label}</OffsettedListItemCell>
            </OffsettedListItem>
          ))}
        </OffsettedListBody>
      </OffsettedList>
    </>
  );
};
export default ChannelList;
