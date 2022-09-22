import clsx from "clsx";
import { Children, Classes } from "@/checkout-storefront/lib/globalTypes";
import { FC, HTMLAttributes } from "react";

export interface SelectBoxProps
  extends Classes,
    Children,
    Omit<HTMLAttributes<HTMLInputElement>, "children"> {
  value: string;
  selectedValue: string | undefined;
  disabled?: boolean;
}

export const SelectBox: FC<SelectBoxProps> = ({
  children,
  value,
  selectedValue,
  className,
  disabled = false,
  ...rest
}) => {
  const selected = selectedValue === value;

  return (
    <div className={clsx("select-box", { selected, disabled }, className)}>
      <input type="radio" value={value} id={value} {...rest} checked={selected} />
      <label className="w-full" htmlFor={value}>
        {children}
      </label>
    </div>
  );
};
