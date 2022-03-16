import ChannelList from "@templates/ChannelList";
import { useChannelList } from "api/saleor";

export default function Channels() {
  const channels = useChannelList();

  return <ChannelList channels={channels} />;
}
