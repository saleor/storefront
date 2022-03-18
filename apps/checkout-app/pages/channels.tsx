import ChannelList from "frontend/components/templates/ChannelList";
import { useChannelList } from "mocks/saleor";
import { withUrqlClient } from "next-urql";
// import { useChannelsQuery } from "@graphql";

const Channels = () => {
  // const [channelsQuery] = useChannelsQuery();
  const channels = useChannelList();

  return <ChannelList channels={channels} />;
};
export default withUrqlClient(() => ({
  url: process.env.NEXT_PUBLIC_API_URL,
}))(Channels);
