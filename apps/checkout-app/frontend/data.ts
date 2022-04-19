import { ChannelFragment } from "@/graphql";
import { findById } from "@/utils";
import {
  customizations,
  paymentMethods,
  paymentProviders,
} from "config/fields";
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

export const getCustomizationSettings = (
  settingsValues: UnknownSettingsValues
): Customization<CustomizationID>[] =>
  customizations.map((customization) => ({
    ...customization,
    settings: customization.settings.map(
      (setting: CustomizationSettings<CustomizationID>) => ({
        ...setting,
        value: settingsValues[customization.id][setting.id],
      })
    ),
  }));

export const getPaymentProviderSettings = (
  settingsValues: UnknownSettingsValues
): PaymentProvider<PaymentProviderID>[] =>
  paymentProviders.map((provider) => ({
    ...provider,
    settings: provider.settings.map(
      (setting: PaymentProviderSettings<PaymentProviderID>) => ({
        ...setting,
        value: settingsValues[provider.id][setting.id],
      })
    ),
  }));

export const getChannelPaymentOptionsList = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders
): ChannelPaymentOptions[] =>
  channels.map((channel) => ({
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
export const getChannelPaymentOptions = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders,
  channelId?: string
) =>
  getChannelPaymentOptionsList(channels, activePaymentProviders).find(
    (channelPayments) => channelPayments.channel.id === channelId
  );
