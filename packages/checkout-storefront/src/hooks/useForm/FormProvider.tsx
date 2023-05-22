import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikProvider } from "formik";
import { PropsWithChildren } from "react";
import { Form } from "formik";

export const FormProvider = <TData extends FormDataBase>({
  form,
  children,
}: PropsWithChildren<{
  form: UseFormReturn<TData>;
}>) => (
  // @ts-expect-error because we overwrite some methods
  <FormikProvider value={form}>
    <Form action="post" noValidate={true} onSubmit={form.handleSubmit}>
      {children}
    </Form>
  </FormikProvider>
);
