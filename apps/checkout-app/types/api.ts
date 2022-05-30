import { ChannelFragment } from "@/graphql";
import {
  CustomizationID,
  CustomizationSettingID,
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
  PrivateSettingID,
  PublicSettingID,
  SettingsType,
} from "./common";

export interface SettingValue {
  value: string;
  encrypted: boolean;
}
export type SettingReadMode = "encrypted" | "unencrypted";

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
    [K in PaymentMethodID]: PaymentProviderID | "";
  };
};
export type ChannelActivePaymentProvidersByChannel = {
  [P in PaymentMethodID]: PaymentProviderID | "";
};
export type PaymentProviderSettingsValues<E extends SettingReadMode> = {
  [P in PaymentProviderID]: E extends "unencrypted"
    ? Partial<{
        [K in PaymentProviderSettingID<P>]: string;
      }>
    : {
        [K in PaymentProviderSettingID<P>]: SettingValue;
      };
};
export type CustomizationSettingsValues = {
  [P in CustomizationID]: {
    [K in CustomizationSettingID<P>]: string;
  };
};
export type UnknownPublicSettingsValues = {
  [P in string]: {
    [K in string]: string;
  };
};
export type UnknownPrivateSettingsValues<E extends SettingReadMode> = {
  [P in string]: E extends "unencrypted"
    ? Partial<{
        [K in string]: string;
      }>
    : {
        [K in string]: SettingValue;
      };
};

export type PublicSettingsValues = {
  [P in PublicSettingID[number]]: P extends "customizations"
    ? CustomizationSettingsValues
    : P extends "channelActivePaymentProviders"
    ? ChannelActivePaymentProviders
    : UnknownPublicSettingsValues;
};
export type PrivateSettingsValues<E extends SettingReadMode> = {
  [P in PrivateSettingID[number]]: P extends "paymentProviders"
    ? PaymentProviderSettingsValues<E>
    : UnknownPrivateSettingsValues<E>;
};
export type SettingsValues<
  T extends SettingsType,
  E extends SettingReadMode
> = T extends "public" ? PublicSettingsValues : PrivateSettingsValues<E>;

export type PublicMetafieldsValues = {
  [P in PublicSettingID[number]]?: string;
};
export type PrivateMetafieldsValues = {
  [P in PrivateSettingID[number]]?: string;
};
