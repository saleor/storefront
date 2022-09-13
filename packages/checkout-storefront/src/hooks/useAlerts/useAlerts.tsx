import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Alert, AlertType, AlertErrorData, CheckoutScope, CustomError } from "./types";
import { toast } from "react-toastify";
import { camelCase } from "lodash-es";
import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { warnAboutMissingTranslation } from "../useFormattedMessages/utils";
import { Text } from "@saleor/ui-kit";

export interface ScopedAlertsProps {
  showErrors: (errors: ApiErrors<any>) => void;
  showCustomErrors: (errors: CustomError[]) => void;
}

function useAlerts(scope: CheckoutScope): ScopedAlertsProps;

function useAlerts(): {
  showErrors: (errors: ApiErrors<any>, scope: CheckoutScope) => void;
  showCustomErrors: (errors: CustomError[], scope: CheckoutScope) => void;
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

  const showDefaultAlert = (
    alertErrorData: AlertErrorData,
    { type }: { type: AlertType } = { type: "error" }
  ) => {
    const parsedAlert = getParsedAlert(alertErrorData, type);
    showAlert(parsedAlert);
  };

  const showAlert = ({
    message,
    type = "error",
    ...rest
  }: Pick<Alert, "message"> & { type?: AlertType; id?: string }) =>
    toast(<Text>{message}</Text>, { type, ...rest });

  const showErrors = (errors: ApiErrors<any>, scope: CheckoutScope = globalScope) =>
    getParsedApiErrors(errors).forEach((error) => showDefaultAlert({ ...error, scope }));

  const showCustomErrors = (errors: CustomError[], scope: CheckoutScope = globalScope) =>
    errors.forEach(({ field = "", message, code }) => {
      if (message) {
        showAlert({ message });
      } else {
        showDefaultAlert({ scope, field, code });
      }
    });

  return { showErrors, showCustomErrors };
}

export { useAlerts };
