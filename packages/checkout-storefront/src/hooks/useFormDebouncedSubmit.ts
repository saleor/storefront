import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { debounce, isEqual } from "lodash-es";
import { useCallback, useRef } from "react";

interface UseFormAutofillSubmit<TFormData extends FormDataBase> {
  onSubmit: (formData: TFormData) => Promise<any> | void;
  getValues: () => TFormData;
  defaultFormData?: TFormData;
}

export const useFormDebouncedSubmit = <TFormData extends FormDataBase>({
  defaultFormData,
  getValues,
  onSubmit,
}: UseFormAutofillSubmit<TFormData>) => {
  const previousFormData = useRef<TFormData | undefined>(defaultFormData);

  // because eslint is unable to read deps inside of debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(
    debounce(() => {
      const formData = getValues();

      if (isEqual(formData, previousFormData.current)) {
        return;
      }

      previousFormData.current = formData;
      void onSubmit(formData);
    }, 2000),
    [onSubmit, getValues]
  );

  return debouncedSubmit;
};
