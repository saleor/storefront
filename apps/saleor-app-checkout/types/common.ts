import { IconComponent, PaymentMethodID, PaymentProviderID, SettingType } from "checkout-common";

export type SettingsType = "public" | "private";
export const allPublicMetafieldID = ["customizationsCheckoutUrl"] as const;
export const allPublicSettingID = ["customizations", "channelActivePaymentProviders"] as const;
export const allPrivateSettingID = ["paymentProviders"] as const;
export const allPublicTransactionMetafieldID = ["processedEvents"] as const;
export const allSettingID = [...allPublicSettingID, ...allPrivateSettingID] as const;
export type PublicMetafieldID = typeof allPublicMetafieldID;
export type PublicSettingID = typeof allPublicSettingID;
export type PublicTransactionMetafieldID = typeof allPublicTransactionMetafieldID;
export type PrivateSettingID = typeof allPrivateSettingID;
export type MetafieldID = PublicMetafieldID;
export type SettingID = PublicSettingID | PrivateSettingID;

export type ThemeVariant = "dark" | "light";

/**
 * Customization types
 */
export type CustomizationID = "branding" | "productSettings";
export type BrandingCustomizationSettingID =
  | "buttonBgColorPrimary"
  | "buttonBgColorHover"
  | "borderColorPrimary"
  | "errorColor"
  | "successColor"
  | "textColor"
  | "buttonTextColor"
  | "logoUrl";
export type ProductCustomizationSettingID = "lowStockThreshold";
export type CustomizationSettingID<P extends CustomizationID> = P extends "branding"
  ? BrandingCustomizationSettingID
  : P extends "productSettings"
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
export type TransactionProcessedEvents = string[];

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
  logo?: IconComponent;
}

export type OrderPaymentMetafield = {
  session: string;
  provider: PaymentProviderID;
  method: PaymentMethodID;
};
