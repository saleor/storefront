import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { SubmitReturnWithErrors } from "@/checkout-storefront/hooks/useSubmit";
import { FormikHelpers } from "formik";

export type FormSubmitFn<TData extends FormDataBase> = (
  formData: TData,
  formHelpers: FormikHelpers<TData>
) => SubmitReturnWithErrors<TData>;
