import { ChangeHandler } from "@/checkout-storefront/hooks/useForm";
import { TextInput as UiKitTextInput } from "@saleor/ui-kit";
import { TextInputProps as UiKitTextInputProps } from "@saleor/ui-kit";
import { Field, FieldProps } from "formik";
import { AllHTMLAttributes } from "react";

export interface TextInputProps<TName extends string>
  extends Omit<AllHTMLAttributes<HTMLInputElement>, "form">,
    Pick<UiKitTextInputProps, "classNames"> {
  name: TName;
  label: string;
  optional?: boolean;
  onChange?: ChangeHandler<HTMLInputElement>;
}

export const TextInput = <TName extends string>(props: TextInputProps<TName>) => (
  <Field {...props} component={TextInputComponent} />
);

const TextInputComponent = <TName extends string>({
  field,
  form: { touched, errors },
  optional,
  ...props
}: FieldProps<TName> & TextInputProps<TName>) => (
  <UiKitTextInput
    required={!optional}
    error={touched[field.name] ? (errors[field.name] as string) : undefined}
    {...field}
    {...props}
  />
);
