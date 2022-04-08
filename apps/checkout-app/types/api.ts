import { ChannelFragment, ChannelsQuery } from "@/graphql";
import {
  CustomizationID,
  CustomizationSettingID,
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
  SettingID,
} from "./common";

export interface PaymentOption {
  id: string;
  method: PaymentMethod;
  availableProviders: PaymentProvider<PaymentProviderID>[];
  activeProvider: PaymentProvider<PaymentProviderID> | null;
}
export interface ChannelPaymentOptions {
  id: string;
  channel: ChannelFragment;
  paymentOptions: PaymentOption[];
}

export type ChannelActivePaymentProviders = {
  [P in string]: {
    [K in PaymentMethodID]: PaymentProviderID;
  };
};
export type ChannelActivePaymentProvidersByChannel = {
  [P in PaymentMethodID]: PaymentProviderID;
};
export type PaymentProviderSettingsValues = {
  [P in PaymentProviderID]: {
    [K in PaymentProviderSettingID<P>]: string;
  };
};
export type CustomizationSettingsValues = {
  [P in CustomizationID]: {
    [K in CustomizationSettingID<P>]: string;
  };
};
export type UnknownSettingsValues<T = string> = {
  [P in string]: {
    [K in string]: T;
  };
};

export type SettingsValues = {
  [P in SettingID[number]]: P extends "customizations"
    ? CustomizationSettingsValues
    : P extends "paymentProviders"
    ? PaymentProviderSettingsValues
    : P extends "channelActivePaymentProviders"
    ? ChannelActivePaymentProviders
    : UnknownSettingsValues;
};
