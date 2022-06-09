import {
  BrandingCustomizationSettingID,
  CustomizationID,
  ProductCustomizationSettingID,
} from "@/checkout-app/types/common";
import { defineMessages } from "react-intl";

export const customizationMessages = defineMessages<CustomizationID>({
  branding: {
    defaultMessage: "Branding",
    description: "customization",
  },
  productSettings: {
    defaultMessage: "Product settings",
    description: "customization",
  },
});

export const brandingCustomizationMessages =
  defineMessages<BrandingCustomizationSettingID>({
    buttonBgColorPrimary: {
      defaultMessage: "Button BG Primary",
      description: "customization setting",
    },
    buttonBgColorHover: {
      defaultMessage: "Button BG Hover",
      description: "customization setting",
    },
    borderColorPrimary: {
      defaultMessage: "Border Primary",
      description: "customization setting",
    },
    errorColor: {
      defaultMessage: "Error",
      description: "customization setting",
    },
    successColor: {
      defaultMessage: "Success",
      description: "customization setting",
    },
    buttonTextColor: {
      defaultMessage: "Button Text",
      description: "customization setting",
    },
    textColor: {
      defaultMessage: "Text",
      description: "customization setting",
    },
    logoUrl: {
      defaultMessage: "Logo",
      description: "customization setting",
    },
  });

export const sectionsCustomizationMessages =
  defineMessages<ProductCustomizationSettingID>({
    lowStockThreshold: {
      defaultMessage: "Low stock threshold",
      description: "customization setting",
    },
  });
