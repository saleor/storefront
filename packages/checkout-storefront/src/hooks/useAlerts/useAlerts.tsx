import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Alert, AlertType, AlertErrorData, CheckoutScope, CustomError } from "./types";
import { toast } from "react-toastify";
import { camelCase } from "lodash-es";
import { warnAboutMissingTranslation } from "../useFormattedMessages/utils";
import { Text } from "@saleor/ui-kit";
import { useCallback } from "react";
import { apiErrorMessages as errorMessages } from "@/checkout-storefront/hooks/useAlerts/messages";
import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { ApiErrors } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { useGetParsedErrors } from "@/checkout-storefront/hooks/useGetParsedErrors";

function useAlerts(scope: CheckoutScope): {
  showErrors: (errors: ApiErrors<any>) => void;
  showCustomErrors: (errors: CustomError[]) => void;
};

function useAlerts(): {
  showErrors: (errors: ApiErrors<any>, scope: CheckoutScope) => void;
  showCustomErrors: (errors: CustomError[], scope?: CheckoutScope) => void;
};

function useAlerts(globalScope?: any): any {
  const formatMessage = useFormattedMessages();
  const { getParsedApiErrors } = useGetParsedErrors<any>();

  const getMessageKey = ({ scope, field, code }: AlertErrorData, { error } = { error: false }) => {
    const keyBase = `${scope}-${field}-${code}`;
    return camelCase(error ? `${keyBase}-error` : keyBase);
  };

  const getErrorMessage = useCallback(
    ({ code, field, scope }: AlertErrorData): string => {
      const messageKey = getMessageKey(
        { code, field, scope },
        { error: true }
      ) as keyof typeof errorMessages;

      try {
        const fullMessage = formatMessage(errorMessages[messageKey]);

        return fullMessage;
      } catch (e) {
        warnAboutMissingTranslation(messageKey);
        return formatMessage(errorMessages.somethingWentWrong);
      }
    },
    [formatMessage]
  );

  const getParsedAlert = useCallback(
    (data: AlertErrorData, type: AlertType): Alert => {
      const { scope, field, code } = data;

      return {
        id: camelCase(`${scope}-${field}-${code}`),
        message: getErrorMessage({ scope, code, field }),
        type,
      };
    },
    [getErrorMessage]
  );

  const showAlert = useCallback(
    ({
      message,
      type = "error",
      ...rest
    }: Pick<Alert, "message"> & { type?: AlertType; id?: string }) =>
      toast(<Text>{message}</Text>, { type, ...rest }),
    []
  );

  const showDefaultAlert = useCallback(
    (alertErrorData: AlertErrorData, { type }: { type: AlertType } = { type: "error" }) => {
      const parsedAlert = getParsedAlert(alertErrorData, type);
      showAlert(parsedAlert);
    },
    [showAlert, getParsedAlert]
  );

  const showErrors = useCallback(
    (errors: ApiErrors<any>, scope: CheckoutScope = globalScope) =>
      getParsedApiErrors(errors).forEach((error) =>
        showDefaultAlert({ ...error, scope } as AlertErrorData)
      ),
    [getParsedApiErrors, showDefaultAlert, globalScope]
  );

  const showCustomErrors = useCallback(
    (errors: CustomError[], scope: CheckoutScope = globalScope) => {
      const parsedErrors = errors.map((error) => ({ field: "", message: "", code: "", ...error }));

      parsedErrors.forEach(({ field, message, code }) => {
        if (message) {
          showAlert({ message });
        } else if (field && code) {
          showDefaultAlert({ scope, field, code: code as ErrorCode });
        }
      });
    },
    [globalScope, showAlert, showDefaultAlert]
  );

  return { showErrors, showCustomErrors };
}

export { useAlerts };
