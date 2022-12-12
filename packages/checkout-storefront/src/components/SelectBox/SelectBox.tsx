import clsx from "clsx";
import { Children, Classes } from "@/checkout-storefront/lib/globalTypes";
import { HTMLAttributes } from "react";
import { useField, useFormikContext } from "formik";

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
  id,
  disabled = false,
  name,
  value,
}: SelectBoxProps<TFieldName>) => {
  const { values } = useFormikContext<Record<TFieldName, string>>();
  const [field] = useField(name);
  const selected = values[name] === value;

  return (
    <div className={clsx("select-box", { selected, disabled }, className)}>
      <input type="radio" {...field} id={value || id} value={value} checked={selected} />
      <label className="w-full" htmlFor={value || id}>
        {children}
      </label>
    </div>
  );
};
