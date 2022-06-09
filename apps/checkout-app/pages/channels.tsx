import ChannelList from "frontend/components/templates/ChannelList";
import { useChannelsQuery } from "@/checkout-app/graphql";
import { useAuthData } from "@/checkout-app/frontend/hooks/useAuthData";

const Channels = () => {
  const { isAuthorized } = useAuthData();
  const [channelsQuery] = useChannelsQuery({
    pause: !isAuthorized,
  });

  const channels = channelsQuery.data?.channels || [];

  return <ChannelList channels={channels} loading={channelsQuery.fetching} />;
};
export default Channels;
