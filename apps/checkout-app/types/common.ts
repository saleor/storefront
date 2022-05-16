import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { StaticImageData } from "next/image";

export type SettingsType = "public" | "private";
export const allPublicSettingID = [
  "customizations",
  "channelActivePaymentProviders",
] as const;
export const allPrivateSettingID = ["paymentProviders"] as const;
export const allSettingID = [
  ...allPublicSettingID,
  ...allPrivateSettingID,
] as const;
export type PublicSettingID = typeof allPublicSettingID;
export type PrivateSettingID = typeof allPrivateSettingID;
export type SettingID = PublicSettingID | PrivateSettingID;
export type SettingType = "string" | "color" | "image";

export type ThemeVariant = "dark" | "light";

export type IconComponent = OverridableComponent<SvgIconTypeMap<{}, "svg">>;

/**
 * Payment types
 */
export type PaymentMethodID = "creditCard" | "applePay" | "paypal";
export interface PaymentMethod {
  id: PaymentMethodID;
  name: string;
  logo?: IconComponent;
}

export type PaymentProviderID = "mollie" | "adyen";
export type MollieProviderSettingID = "partnerId" | "liveApiKey" | "testApiKey";
export type AdyenProviderSettingID =
  | "merchantAccount"
  | "clientKey"
  | "supportedCurrencies";
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
  logo?: IconComponent;
  settings: PaymentProviderSettings<P>[];
}

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
export type CustomizationSettingID<P extends CustomizationID> =
  P extends "branding"
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
