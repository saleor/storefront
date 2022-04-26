import { ChannelFragment } from "@/graphql";
import { findById } from "@/utils";
import {
  useCustomizations,
  usePaymentMethods,
  usePaymentProviders,
} from "@/config/fields";
import {
  ChannelActivePaymentProviders,
  ChannelPaymentOptions,
  UnknownSettingsValues,
} from "types/api";
import {
  Customization,
  CustomizationID,
  CustomizationSettings,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettings,
} from "types/common";

export const useCustomizationSettings = (
  settingsValues: UnknownSettingsValues
): Customization<CustomizationID>[] =>
  useCustomizations().map((customization) => ({
    ...customization,
    settings: customization.settings.map(
      (setting: CustomizationSettings<CustomizationID>) => ({
        ...setting,
        value: settingsValues[customization.id][setting.id],
      })
    ),
  }));

export const usePaymentProviderSettings = (
  settingsValues: UnknownSettingsValues
): PaymentProvider<PaymentProviderID>[] =>
  usePaymentProviders().map((provider) => ({
    ...provider,
    settings: provider.settings.map(
      (setting: PaymentProviderSettings<PaymentProviderID>) => ({
        ...setting,
        value: settingsValues[provider.id][setting.id],
      })
    ),
  }));

export const useChannelPaymentOptionsList = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders
): ChannelPaymentOptions[] => {
  const paymentMethods = usePaymentMethods();
  const paymentProviders = usePaymentProviders();

  return channels.map((channel) => ({
    id: channel.id,
    channel: channel,
    paymentOptions: paymentMethods.map((method) => {
      const activeProvider =
        (activePaymentProviders?.[channel.id]?.[method.id] &&
          findById(
            paymentProviders,
            activePaymentProviders[channel.id][method.id]
          )) ||
        null;

      return {
        id: method.id,
        method,
        availableProviders: paymentProviders,
        activeProvider,
      };
    }),
  }));
};
export const useChannelPaymentOptions = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders,
  channelId?: string
) =>
  useChannelPaymentOptionsList(channels, activePaymentProviders).find(
    (channelPayments) => channelPayments.channel.id === channelId
  );
