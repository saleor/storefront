import ChannelList from "@templates/ChannelList";
import { useChannelList } from "api/saleor/api";

export default function Channels() {
  const channels = useChannelList();

  return <ChannelList channels={channels} />;
}
