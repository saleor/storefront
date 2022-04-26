import { MetadataErrorCode } from "@/graphql";
import { IntlShape } from "react-intl";
import { commonErrorMessages } from "./errorMessages";
import camelCase from "lodash/camelCase";

export const getMetadataErrorMessage = (
  code: MetadataErrorCode,
  intl: IntlShape
) => {
  const errorMessage =
    commonErrorMessages[camelCase(code) as keyof typeof commonErrorMessages] ||
    commonErrorMessages.unknown;

  return intl.formatMessage(errorMessage);
};
