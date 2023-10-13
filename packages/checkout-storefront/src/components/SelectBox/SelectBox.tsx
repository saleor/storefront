import clsx from "clsx";
import { Children, Classes } from "@/checkout-storefront/lib/globalTypes";
import { HTMLAttributes, useState } from "react";
import { useFormContext } from "@/checkout-storefront/hooks/useForm";
import { useField } from "formik";

export interface SelectBoxProps<TFieldName extends string>
  extends Classes,
    Children,
    Omit<HTMLAttributes<HTMLInputElement>, "children"> {
  disabled?: boolean;
  name: TFieldName;
  value: string;
  onRadioChange: (value: string) => void;
}

export const SelectBox = <TFieldName extends string>({
  children,
  className,
  disabled = false,
  name,
  value,
  id,
  onRadioChange,
}: SelectBoxProps<TFieldName>) => {
  // normally we pass value which is sufficient as an id but in case of doubled forms
  // such as shipping addresses and billing addresses etc. we need to pass a unique id
  const identifier = id || value;
  const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
  const [field] = useField(name);
  const selected = values[name] === value;

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected) {
      onRadioChange(value);
    }
    handleChange(event);
  };
  return (
    <div className={clsx("select-box", { selected, disabled }, className)}>
      <input
        type="radio"
        {...field}
        onChange={handleRadioChange}
        value={value}
        checked={selected}
        id={identifier}
      />
      <label className="w-full" htmlFor={identifier}>
        {children}
      </label>
    </div>
  );
};
