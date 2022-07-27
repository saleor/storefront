import { ChannelFragment } from "@/saleor-app-checkout/graphql";
import {
  CustomizationID,
  CustomizationSettingID,
  PrivateSettingID,
  PublicMetafieldID,
  PublicSettingID,
  SettingsType,
} from "./common";

import {
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
} from "checkout-common";

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
export type CustomizationSettingsFiles = {
  [P in CustomizationID]?: {
    [K in CustomizationSettingID<P>]?: File;
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
export type SettingsValues<T extends SettingsType, E extends SettingReadMode> = T extends "public"
  ? PublicSettingsValues
  : PrivateSettingsValues<E>;

export type PublicMetafieldsValues = {
  [P in PublicSettingID[number] | PublicMetafieldID[number]]?: string;
};
export type PrivateMetafieldsValues = {
  [P in PrivateSettingID[number]]?: string;
};
