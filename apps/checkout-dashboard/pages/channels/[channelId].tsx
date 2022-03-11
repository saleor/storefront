import ChannelDetails from "@templates/ChannelDetails";
import { useChannelPaymentOptions } from "api/app/api";
import { useChannelList } from "api/saleor/api";
import { useRouter } from "next/router";

export default function Channel() {
  const router = useRouter();
  const { channelId } = router.query;

  const channels = useChannelList();
  const channelPaymentOptions = useChannelPaymentOptions(channelId?.toString());

  return (
    <ChannelDetails
      channelPaymentOptions={channelPaymentOptions}
      channels={channels}
    />
  );
}
