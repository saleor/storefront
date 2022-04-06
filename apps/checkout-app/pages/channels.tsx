import ChannelList from "frontend/components/templates/ChannelList";
import { useChannelsQuery } from "@graphql";

const Channels = () => {
  const [channelsQuery] = useChannelsQuery();
  const channels = channelsQuery.data?.channels || [];

  return <ChannelList channels={channels} loading={channelsQuery.fetching} />;
};
export default Channels;
