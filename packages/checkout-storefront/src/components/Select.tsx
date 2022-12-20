import { useField } from "formik";
import React from "react";
import { Select as UiKitSelect, SelectProps as UiKitSelectProps } from "@saleor/ui-kit";

interface SelectProps<TName extends string, TData extends string>
  extends Pick<UiKitSelectProps<TData>, "options" | "classNames" | "placeholder" | "autoComplete"> {
  name: TName;
}

export const Select = <TName extends string, TData extends string>({
  name,
  ...rest
}: SelectProps<TName, TData>) => {
  const [field] = useField(name);

  return <UiKitSelect {...rest} {...field} />;
};
