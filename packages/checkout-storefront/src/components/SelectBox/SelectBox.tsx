import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { Classes } from "@/checkout-storefront/lib/globalTypes";

export interface SelectBoxProps extends Classes {
  value: string;
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  disabled?: boolean;
}

export const SelectBox: React.FC<PropsWithChildren<SelectBoxProps>> = ({
  children,
  value,
  onSelect,
  selectedValue,
  className,
  disabled = false,
}) => {
  const selected = selectedValue === value;

  const handleClick = () => {
    if (disabled) {
      return;
    }
    onSelect(value);
  };

  return (
    <div
      className={clsx("select-box", selected && "selected", disabled && "disabled", className)}
      onClick={handleClick}
    >
      <div className="grow">{children}</div>
    </div>
  );
};
