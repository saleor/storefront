import { Channel } from "./types";

// Should be fetched from saleor backend
export const channelList: Channel[] = [
  {
    id: "channel-1",
    label: "B2B Channel",
  },
  {
    id: "channel-2",
    label: "B2C Channel",
  },
];
export const useChannelList = () => channelList;
