import React, { AllHTMLAttributes } from "react";
import { TextInput as UiKitTextInput } from "@saleor/ui-kit";
import { TextInputProps as UiKitTextInputProps } from "@saleor/ui-kit";
import { ErrorMessage, useField } from "formik";

export interface TextInputProps<TName extends string>
  extends Omit<AllHTMLAttributes<HTMLInputElement>, "onBlur" | "onChange" | "name" | "ref">,
    Pick<UiKitTextInputProps, "classNames"> {
  name: TName;
  label: string;
  optional?: boolean;
  // icon?: React.ReactNode;
}

export const TextInput = <TName extends string>({ name, optional }: TextInputProps<TName>) => {
  const [field] = useField(name);

  return (
    <>
      <UiKitTextInput {...field} required={!optional} />
      <ErrorMessage name={name} />
    </>
  );
};
