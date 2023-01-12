import { FormDataBase, FormHelpers } from "@/checkout-storefront/hooks/useForm";
import { SubmitReturnWithErrors } from "@/checkout-storefront/hooks/useSubmit";

export type FormSubmitFn<TData extends FormDataBase> = (
  formData: TData,
  formHelpers: FormHelpers<TData>
) => SubmitReturnWithErrors<TData>;
