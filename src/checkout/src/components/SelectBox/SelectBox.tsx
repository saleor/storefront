import clsx from "clsx";
import { type Children, type Classes } from "@/checkout/src/lib/globalTypes";
import { type HTMLAttributes } from "react";
import { useFormContext } from "@/checkout/src/hooks/useForm";
import { useField } from "formik";

export interface SelectBoxProps<TFieldName extends string>
  extends Classes,
    Children,
    Omit<HTMLAttributes<HTMLInputElement>, "children"> {
  disabled?: boolean;
  name: TFieldName;
  value: string;
}

export const SelectBox = <TFieldName extends string>({
  children,
  className,
  disabled = false,
  name,
  value,
  id,
}: SelectBoxProps<TFieldName>) => {
  // normally we pass value which is sufficient as an id but in case of doubled forms
  // such as shipping addresses and billing addresses etc. we need to pass a unique id
  const identifier = id || value;
  const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
  const [field] = useField(name);
  const selected = values[name] === value;

  return (
    <div className={clsx("select-box", { selected, disabled }, className)}>
      <input
        type="radio"
        {...field}
        onChange={handleChange}
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
