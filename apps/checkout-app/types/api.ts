import { Channel } from "./saleor";
import {
  CustomizationID,
  CustomizationSettingID,
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
} from "./common";

export interface PaymentOption {
  id: string;
  method: PaymentMethod;
  availableProviders: PaymentProvider<PaymentProviderID>[];
  activeProvider: PaymentProvider<PaymentProviderID> | null;
}
export interface ChannelPaymentOptions {
  id: string;
  channel: Channel;
  paymentOptions: PaymentOption[];
}
export type ChannelActivePaymentProviders = {
  [P in PaymentMethodID]: {
    [K in string]: PaymentProviderID;
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
export type UnknownSettingsValues = {
  [P in string]: {
    [K in string]: string;
  };
};
