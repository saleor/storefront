import React from "react";
import { Checkbox as UiKitCheckbox, ClassNames } from "@saleor/ui-kit";
import { useField } from "formik";

interface CheckboxProps<TName extends string> {
  name: TName;
  label: string;
  classNames: ClassNames<"container">;
}

export const Checkbox = <TName extends string>({ name, label }: CheckboxProps<TName>) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const checked = value === field.value;

  return (
    <UiKitCheckbox
      {...field}
      label={label}
      name={name}
      checked={checked}
      onChange={() => setValue(!checked)}
    />
  );
};
