import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Alert, AlertType, AlertErrorData, CheckoutScope } from "./types";
import { toast } from "react-toastify";
import { camelCase } from "lodash-es";
import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { warnAboutMissingTranslation } from "../useFormattedMessages/utils";

export interface ScopedAlertsProps {
  showErrors: (errors: AlertErrorData[]) => void;
  showCustomErrors: (errors: ErrorCode[]) => void;
}

function useAlerts(scope: CheckoutScope): ScopedAlertsProps;

function useAlerts(): {
  showErrors: (errors: AlertErrorData[], scope: CheckoutScope) => void;
  showCustomErrors: (errors: ErrorCode[], scope: CheckoutScope) => void;
};

function useAlerts(globalScope?: any): any {
  const formatMessage = useFormattedMessages();
  const { getMessageByErrorCode } = useErrorMessages();
  const getParsedApiErrors = useGetParsedApiErrors();

  const getErrorMessage = ({ scope, code, field }: AlertErrorData): string => {
    const messageKey = camelCase(`${scope}-${field}-${code}-error`);

    try {
      const fullMessage = formatMessage(messageKey as MessageKey);

      return fullMessage;
    } catch (e) {
      warnAboutMissingTranslation(messageKey);

      return `${getMessageByErrorCode(code)}: ${formatMessage(field as MessageKey)}`;
    }
  };

  const getParsedAlert = (data: AlertErrorData, type: AlertType): Alert => {
    const { scope, field, code } = data;

    return {
      id: camelCase(`${scope}-${field}-${code}`),
      message: getErrorMessage({ scope, code, field }),
      type,
    };
  };

  const showAlert = ({ scope, ...dataRest }: AlertErrorData, { type }: { type: AlertType }) => {
    const { message, ...options } = getParsedAlert({ ...dataRest, scope }, type);
    toast(message, options);
  };

  const showErrors = (errors: ApiErrors<any>, scope: CheckoutScope = globalScope) =>
    getParsedApiErrors(errors).forEach((error) =>
      showAlert({ ...error, scope }, { type: "error" })
    );

  const showCustomErrors = (errors: ErrorCode[], scope: CheckoutScope = globalScope) =>
    errors.forEach((code: ErrorCode) => showAlert({ scope, code, field: "" }, { type: "error" }));

  return { showErrors, showCustomErrors };
}

export { useAlerts };
