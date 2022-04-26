import { useErrorsContext } from "./ErrorsProvider";
import { Errors, ErrorScope, SetApiErrors, SetErrors } from "./types";

export interface UseErrorsProps<TFormData> {
  setErrors: SetErrors<TFormData>;
  setApiErrors: SetApiErrors<TFormData>;
  clearErrors: () => void;
  errors: Errors<TFormData>;
  hasErrors: boolean;
}
export const useErrors = function <TFormData>(
  scope: ErrorScope
): UseErrorsProps<TFormData> {
  const { setErrors, setApiErrors, clearErrors, errorsState } =
    useErrorsContext();

  const errors = errorsState[scope] || {};

  return {
    setErrors: setErrors(scope),
    setApiErrors: setApiErrors(scope),
    errors,
    hasErrors: Object.keys(errors).length > 0,
    clearErrors: clearErrors(scope),
  };
};
