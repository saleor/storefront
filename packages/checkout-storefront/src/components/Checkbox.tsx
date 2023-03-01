import React from "react";
import { Checkbox as UiKitCheckbox, ClassNames } from "@saleor/ui-kit";
import { useField } from "formik";
import { useFormContext } from "@/checkout-storefront/hooks/useForm";

interface CheckboxProps<TName extends string> {
  name: TName;
  label: string;
  classNames: ClassNames<"container">;
}

export const Checkbox = <TName extends string>({ name, label }: CheckboxProps<TName>) => {
  const { handleChange } = useFormContext<Record<TName, string>>();
  const [field, { value }] = useField(name);

  return (
    <UiKitCheckbox
      {...field}
      label={label}
      name={name}
      checked={value}
      onChange={(event) => {
        handleChange({ ...event, target: { ...event.target, name, value: !value } });
      }}
    />
  );
};
