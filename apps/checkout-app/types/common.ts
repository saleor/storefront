export const allSettingID = [
  "customizations",
  "paymentProviders",
  "channelActivePaymentProviders",
] as const;
export type SettingID = typeof allSettingID;
export type SettingType = "string" | "color" | "image";

/**
 * Payment types
 */
export type PaymentMethodID = "credit-card" | "apple-pay" | "paypal";
export interface PaymentMethod {
  id: PaymentMethodID;
  name: string;
}

export type PaymentProviderID = "mollie" | "adyen";
export type MollieProviderSettingID = "partner-id" | "live-test-api-key";
export type AdyenProviderSettingID =
  | "merchant-account"
  | "client-key"
  | "supported-currencies";
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
}
export interface PaymentProvider<P extends PaymentProviderID> {
  id: P;
  label: string;
  settings: PaymentProviderSettings<P>[];
}

/**
 * Customization types
 */
export type CustomizationID = "branding" | "product-settings";
export type BrandingCustomizationSettingID =
  | "active"
  | "text"
  | "bg"
  | "error"
  | "success"
  | "logo";
export type ProductCustomizationSettingID = "low-stock-threshold";
export type CustomizationSettingID<P extends CustomizationID> =
  P extends "branding"
    ? BrandingCustomizationSettingID
    : P extends "product-settings"
    ? ProductCustomizationSettingID
    : never;

export interface CustomizationSettings<P extends CustomizationID> {
  id: CustomizationSettingID<P>;
  label: string;
  type: SettingType;
  value?: string;
}
export interface Customization<P extends CustomizationID> {
  id: P;
  label: string;
  settings: CustomizationSettings<P>[];
}

/**
 * Common types
 */
export interface Node {
  id: string;
}
export interface NamedNode extends Node {
  name: string;
}
export interface Item {
  id: string;
  label: string;
}
