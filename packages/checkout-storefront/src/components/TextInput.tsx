import React, { AllHTMLAttributes } from "react";
import { TextInput as UiKitTextInput } from "@saleor/ui-kit";
import { TextInputProps as UiKitTextInputProps } from "@saleor/ui-kit";
import { ErrorMessage, useField } from "formik";

export interface TextInputProps<TName extends string>
  extends AllHTMLAttributes<HTMLInputElement>,
    Pick<UiKitTextInputProps, "classNames"> {
  name: TName;
  label: string;
  optional?: boolean;
}

export const TextInput = <TName extends string>({
  name,
  optional,
  ...rest
}: TextInputProps<TName>) => {
  const [field] = useField(name);

  return (
    <>
      <UiKitTextInput {...rest} {...field} required={!optional} />
      <ErrorMessage name={name} />
    </>
  );
};
