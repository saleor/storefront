import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { debounce, isEqual, throttle } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import { Path, UseFormReturn, UseFormStateReturn } from "react-hook-form";

interface UseFormAutofillSubmit<TFormData extends FormDataBase>
  extends Pick<UseFormReturn<TFormData>, "watch" | "trigger">,
    Pick<UseFormStateReturn<TFormData>, "isDirty"> {
  onSubmit: (formData: TFormData) => Promise<void> | void;
  formData: TFormData;
  defaultFormData?: TFormData;
  autoSave: boolean;
}

export const useFormAutofillSubmit = <TFormData>({
  formData,
  defaultFormData,
  onSubmit,
  isDirty,
  trigger,
  autoSave,
}: UseFormAutofillSubmit<TFormData>) => {
  const formDataRef = useRef<TFormData | undefined>(defaultFormData);

  const debouncedSubmit = useCallback(
    debounce((formData) => {
      if (!isDirty) {
        return;
      }

      void onSubmit(formData);
    }, 2000),
    [isDirty]
  );

  const throttledTrigger = useCallback(
    throttle((formData) => {
      const fieldsToValidate = Object.entries(formData)
        .filter(
          ([fieldName, fieldValue]) =>
            formDataRef.current?.[fieldName as keyof TFormData] !== fieldValue
        )
        .map(([fieldName]) => fieldName);

      formDataRef.current = formData;
      void trigger(fieldsToValidate as Array<Path<TFormData>>);
    }, 2000),
    []
  );

  useEffect(() => {
    const hasAutofilled = !isEqual(formData, formDataRef.current);

    if (hasAutofilled && autoSave) {
      void throttledTrigger(formData);
      void debouncedSubmit(formData);
    }
  }, [debouncedSubmit, formData]);

  return debouncedSubmit;
};
