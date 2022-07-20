import type { IconComponent } from "./icon";
import type { SettingType } from "./settings";

export type PaymentMethodID = "creditCard" | "applePay" | "paypal";
export interface PaymentMethod {
  id: PaymentMethodID;
  name: string;
  logo?: IconComponent;
}
export type PaymentProviderID = "mollie" | "adyen";
export type MollieProviderSettingID = "profileId" | "apiKey";
export type AdyenProviderSettingID =
  | "merchantAccount"
  | "hmac"
  | "username"
  | "password"
  | "apiKey"
  | "clientKey";

export type PaymentProviderSettingID<P extends PaymentProviderID> =
  P extends "mollie"
    ? MollieProviderSettingID
    : P extends "adyen"
    ? AdyenProviderSettingID
    : never;

export interface PaymentProviderSettings<P extends PaymentProviderID> {
  id: PaymentProviderSettingID<P>;
  label: string;
  type: SettingType;
  value?: string;
  encrypt: boolean;
}

export interface PaymentProvider<P extends PaymentProviderID> {
  id: P;
  label: string;
  logo?: IconComponent;
  settings: PaymentProviderSettings<P>[];
}
