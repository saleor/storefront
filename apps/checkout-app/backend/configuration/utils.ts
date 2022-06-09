import { defaultActiveChannelPaymentProviders } from "@/checkout-app/config/defaults";
import { ChannelFragment } from "@/checkout-app/graphql";
import {
  ChannelActivePaymentProviders,
  PublicSettingsValues,
} from "@/checkout-app/types/api";

export const mergeChannelsWithPaymentProvidersSettings = (
  settings: PublicSettingsValues,
  channels?: ChannelFragment[] | null
): ChannelActivePaymentProviders =>
  channels?.reduce((assignedSettings, channel) => {
    const channelSettings =
      assignedSettings[channel.id] || defaultActiveChannelPaymentProviders;

    return {
      ...assignedSettings,
      [channel.id]: channelSettings,
    };
  }, settings.channelActivePaymentProviders) ||
  settings.channelActivePaymentProviders;
