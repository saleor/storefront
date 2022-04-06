import AppNavigation from "@frontend/components/elements/AppNavigation";
import {
  OffsettedList,
  OffsettedListBody,
  OffsettedListHeader,
  OffsettedListItem,
  OffsettedListItemCell,
} from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { channelPath } from "routes";
import { useStyles } from "./styles";
import { FormattedMessage } from "react-intl";
import { messages } from "./messages";
import { ChannelFragment } from "@graphql";
import Skeleton from "@material-ui/lab/Skeleton";

interface ChannelListProps {
  channels: ChannelFragment[];
  loading: boolean;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, loading }) => {
  const router = useRouter();
  const classes = useStyles();

  const onChannelClick = (channel: ChannelFragment) => {
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
          {loading ? (
            <Skeleton />
          ) : (
            channels.map((channel) => (
              <OffsettedListItem
                key={channel.id}
                className={classes.listItem}
                onClick={() => onChannelClick(channel)}
              >
                <OffsettedListItemCell>{channel.name}</OffsettedListItemCell>
              </OffsettedListItem>
            ))
          )}
        </OffsettedListBody>
      </OffsettedList>
    </>
  );
};
export default ChannelList;
