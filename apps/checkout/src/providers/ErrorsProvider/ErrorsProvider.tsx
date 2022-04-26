import { useGetFormErrorsFromApiErrors } from "@/lib/utils";
import { PropsWithChildren, useState } from "react";
import createSafeContext from "@/providers/createSafeContext";
import {
  ApiErrors,
  Errors,
  ErrorScope,
  SetApiErrors,
  SetErrors,
} from "./types";
import { omit } from "lodash-es";

export type ErrorsContextConsumerProps = {
  errorsState: ErrorsState;
  setErrors: <TFormData>(scope: ErrorScope) => SetErrors<TFormData>;
  setApiErrors: <TFormData>(scope: ErrorScope) => SetApiErrors<TFormData>;
  clearErrors: (scope: ErrorScope) => () => void;
};

export const [useErrorsContext, Provider] =
  createSafeContext<ErrorsContextConsumerProps>();

export type ErrorsState = Partial<Record<ErrorScope, Errors<any>>>;

export const ErrorsProvider = ({ children }: PropsWithChildren<{}>) => {
  const getErrorsFromApi = useGetFormErrorsFromApiErrors();

  const [errorsState, handleSetErrorsState] = useState<ErrorsState>({});

  const setApiErrors = function <TFormData>(scope: ErrorScope) {
    return (apiErrors: ApiErrors<TFormData>) =>
      handleSetErrorsState({
        ...errorsState,
        [scope]: getErrorsFromApi(apiErrors),
      });
  };

  const clearErrors = (scope: ErrorScope) => () =>
    handleSetErrorsState(omit(errorsState, scope));

  const setErrors = function <TFormData>(scope: ErrorScope) {
    return (errors: Errors<TFormData>) => {
      handleSetErrorsState({ ...errors, [scope]: errors });
    };
  };

  const providerValues: ErrorsContextConsumerProps = {
    errorsState,
    setErrors,
    setApiErrors,
    clearErrors,
  };

  return <Provider value={providerValues}>{children}</Provider>;
};
