import { Channel } from "api/saleor/types";
import {
  CustomizationID,
  CustomizationSettingID,
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
} from "types";

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
