import type { IconComponent } from "./icon";
import type { SettingType } from "./settings";

export const PaymentMethods = ["creditCard", "applePay", "paypal"] as const;
export type PaymentMethodID = typeof PaymentMethods[number];
export interface PaymentMethod {
  id: PaymentMethodID;
  name: string;
  logo?: IconComponent;
}
export type MollieProviderSettingID = "profileId" | "apiKey";
export type AdyenProviderSettingID =
  | "merchantAccount"
  | "hmac"
  | "username"
  | "password"
  | "apiKey"
  | "clientKey";
export type StripeProviderSettingID = "publishableKey" | "secretKey" | "webhookSecret";

export const PaymentProviders: readonly (keyof PaymentProviderToSettings)[] = [
  "mollie",
  "adyen",
  "stripe",
] as const;
export type PaymentProviderID = typeof PaymentProviders[number];

export type PaymentProviderToSettings = {
  mollie: MollieProviderSettingID;
  adyen: AdyenProviderSettingID;
  stripe: StripeProviderSettingID;
};

export type PaymentProviderSettingID<P extends PaymentProviderID> = PaymentProviderToSettings[P];

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
