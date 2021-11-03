import { useContext } from "react";

import { ChannelsConsumerProps, ChannelsContext } from "./ChannelsProvider";

const useChannels = (): ChannelsConsumerProps => {
  const channelsConsumerProps = useContext(ChannelsContext);

  return channelsConsumerProps;
};

export default useChannels;
