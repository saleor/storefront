export type BrandingColors = Record<
  | "buttonBgColorPrimary"
  | "buttonBgColorHover"
  | "borderColorPrimary"
  | "errorColor"
  | "successColor"
  | "textColor"
  | "buttonTextColor",
  string
>;

export type BrandingColorsData = Partial<BrandingColors>;

export interface AppConfig {
  branding: BrandingColorsData;
}
