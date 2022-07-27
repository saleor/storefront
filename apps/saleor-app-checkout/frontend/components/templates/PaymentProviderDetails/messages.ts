import { defineMessages } from "react-intl";

export const messages = defineMessages({
  paymentProviderSettings: {
    defaultMessage: "Payment provider settings",
    description: "section title",
  },
  encryptedSettingNotice: {
    defaultMessage: "These information will be encrypted",
    description: "notice for private settings",
  },
  publicSettingNotice: {
    defaultMessage: "These information will not be encrypted",
    description: "notice for private settings",
  },
});
