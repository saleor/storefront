import ChannelDetails from "frontend/components/templates/ChannelDetails";
import { getChannelPaymentOptions } from "mocks/app";
import { useChannelList } from "mocks/saleor";
import { useRouter } from "next/router";

export default function Channel() {
  const router = useRouter();
  const { channelId } = router.query;

  const channels = useChannelList();
  const channelPaymentOptions = getChannelPaymentOptions(channelId?.toString());

  return (
    <ChannelDetails
      channelPaymentOptions={channelPaymentOptions}
      channels={channels}
    />
  );
}
