import ChannelList from "frontend/components/templates/ChannelList";
import { useChannelsQuery } from "@/saleor-app-checkout/graphql";
import { useAuthData } from "@/saleor-app-checkout/frontend/hooks/useAuthData";

const Channels = () => {
  const { isAuthorized } = useAuthData();
  const [channelsQuery] = useChannelsQuery({
    pause: !isAuthorized,
  });

  const channels = channelsQuery.data?.channels || [];

  return <ChannelList channels={channels} loading={channelsQuery.fetching} />;
};
export default Channels;
