import { forEach } from "lodash-es";
import { useEffect } from "react";
import { FieldError, Path, UseFormReturn } from "react-hook-form";
import { ErrorScope } from "./types";
import { useErrors } from "./useErrors";

export type UseSetFormErrorsProps<TFormData> = {
  errorScope: ErrorScope;
} & Pick<UseFormReturn<TFormData>, "setError">;

export const useSetFormErrors = <TFormData,>({
  setError,
  errorScope,
}: UseSetFormErrorsProps<TFormData>) => {
  const { hasErrors, errors } = useErrors(errorScope);

  useEffect(() => {
    if (hasErrors) {
      forEach(errors, (error, key) => {
        setError(key as Path<TFormData>, {
          message: (error as unknown as FieldError).message,
        });
      });
    }
  }, [errors]);
};
