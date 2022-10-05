import { GenericErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { defineMessages } from "react-intl";

export const messages = defineMessages<GenericErrorCode>({
  invalid: {
    defaultMessage: "Invalid value",
    id: "useErrorMessages/messages/ebt/9V",
    description: "invalid value",
  },
  required: {
    defaultMessage: "Required field",
    id: "useErrorMessages/messages/GmjKcs",
    description: "required field",
  },
  unique: {
    defaultMessage: "Value must be unique",
    id: "useErrorMessages/messages/GrUSxl",
    description: "value must be unique",
  },
});
