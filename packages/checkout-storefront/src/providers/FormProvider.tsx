import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikProvider } from "formik";
import { PropsWithChildren } from "react";

export const FormProvider = <TData extends FormDataBase>({
  form,
  children,
}: PropsWithChildren<{
  form: UseFormReturn<TData>;
}>) => <FormikProvider value={form}>{children}</FormikProvider>;
