import { defaultActiveChannelPaymentProviders } from "@/saleor-app-checkout/config/defaults";
import { ChannelFragment } from "@/saleor-app-checkout/graphql";
import {
  ChannelActivePaymentProviders,
  PublicSettingsValues,
} from "@/saleor-app-checkout/types/api";

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
