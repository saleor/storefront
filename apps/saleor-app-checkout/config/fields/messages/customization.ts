import {
  BrandingCustomizationSettingID,
  CustomizationID,
  ProductCustomizationSettingID,
} from "@/saleor-app-checkout/types/common";
import { defineMessages } from "react-intl";

export const customizationMessages = defineMessages<CustomizationID>({
  branding: {
    defaultMessage: "Branding",
    id: "messages/customization/4kEXS+",
    description: "customization",
  },
  productSettings: {
    defaultMessage: "Product settings",
    id: "messages/customization/X5y+L2",
    description: "customization",
  },
});

export const brandingCustomizationMessages = defineMessages<BrandingCustomizationSettingID>({
  buttonBgColorPrimary: {
    defaultMessage: "Button BG Primary",
    id: "messages/customization/D8irjQ",
    description: "customization setting",
  },
  buttonBgColorHover: {
    defaultMessage: "Button BG Hover",
    id: "messages/customization//dYclm",
    description: "customization setting",
  },
  borderColorPrimary: {
    defaultMessage: "Border Primary",
    id: "messages/customization/m/r08F",
    description: "customization setting",
  },
  errorColor: {
    defaultMessage: "Error",
    id: "messages/customization/DopY6P",
    description: "customization setting",
  },
  successColor: {
    defaultMessage: "Success",
    id: "messages/customization/S/xcUp",
    description: "customization setting",
  },
  buttonTextColor: {
    defaultMessage: "Button Text",
    id: "messages/customization/0NYFC/",
    description: "customization setting",
  },
  textColor: {
    defaultMessage: "Text",
    id: "messages/customization/cNpy7H",
    description: "customization setting",
  },
  logoUrl: {
    defaultMessage: "Logo",
    id: "messages/customization/HpJ0xA",
    description: "customization setting",
  },
});

export const sectionsCustomizationMessages = defineMessages<ProductCustomizationSettingID>({
  lowStockThreshold: {
    defaultMessage: "Low stock threshold",
    id: "messages/customization/e9Fc8u",
    description: "customization setting",
  },
});
