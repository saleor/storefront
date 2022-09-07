import { entries } from "@/checkout-storefront/lib/utils";
import { debounce, isEqual, throttle } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import { Path, UseFormReturn } from "react-hook-form";

interface UseFormAutofillSubmit<TFormData>
  extends Pick<UseFormReturn<TFormData>, "watch" | "trigger"> {
  onSubmit: (formData: TFormData) => Promise<void> | void;
  formData: TFormData;
  defaultFormData?: TFormData;
}

export const useFormAutofillSubmit = <TFormData>({
  formData,
  defaultFormData,
  onSubmit,
  trigger,
}: UseFormAutofillSubmit<TFormData>) => {
  const formDataRef = useRef<TFormData | undefined>(defaultFormData);

  const debouncedSubmit = useCallback(
    debounce((formData) => {
      void onSubmit(formData);
    }, 2000),
    []
  );

  const throttledTrigger = useCallback(
    throttle((formData) => {
      const fieldsToValidate = entries(formData)
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

    if (hasAutofilled) {
      void throttledTrigger(formData);
      void debouncedSubmit(formData);
    }
  }, [debouncedSubmit, formData]);

  return debouncedSubmit;
};
