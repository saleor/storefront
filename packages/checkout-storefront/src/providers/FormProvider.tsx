import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikProvider, useFormik } from "formik";
import { PropsWithChildren } from "react";
import { Form } from "formik";

export const FormProvider = <TData extends FormDataBase>({
  form,
  children,
}: PropsWithChildren<{
  form: UseFormReturn<TData>;
}>) => (
  // casting because formik doesn't fancy our stricter typing
  <FormikProvider value={form as ReturnType<typeof useFormik<TData>>}>
    <Form action="post" noValidate={true} onSubmit={form.handleSubmit}>
      {children}
    </Form>
  </FormikProvider>
);
