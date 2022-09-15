import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { debounce } from "lodash-es";
import { useCallback, useRef } from "react";

interface UseFormAutofillSubmit<TFormData extends FormDataBase> {
  onSubmit: (formData: TFormData) => Promise<void> | void;
  defaultFormData?: TFormData;
}

export const useFormDebouncedSubmit = <TFormData extends FormDataBase>({
  defaultFormData,
  onSubmit,
}: UseFormAutofillSubmit<TFormData>) => {
  const formDataRef = useRef<TFormData | undefined>(defaultFormData);

  const debouncedSubmit = useCallback(
    debounce((formData: TFormData) => {
      formDataRef.current = formData;
      void onSubmit(formData);
    }, 2000),
    [onSubmit]
  );

  return debouncedSubmit;
};
