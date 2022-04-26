import ChannelList from "frontend/components/templates/ChannelList";
import { useChannelsQuery } from "@/graphql";
import { useAuthData } from "@/frontend/hooks/useAuthData";

const Channels = () => {
  const { isAuthorized } = useAuthData();
  const [channelsQuery] = useChannelsQuery({
    pause: !isAuthorized,
  });

  const channels = channelsQuery.data?.channels || [];

  return <ChannelList channels={channels} loading={channelsQuery.fetching} />;
};
export default Channels;
