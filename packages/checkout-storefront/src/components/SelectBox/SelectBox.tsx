import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { Classes } from "@/checkout-storefront/lib/globalTypes";

export interface SelectBoxProps extends Classes {
  value: string;
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
}

export const SelectBox: React.FC<PropsWithChildren<SelectBoxProps>> = ({
  children,
  value,
  onSelect,
  selectedValue,
  className,
}) => {
  const selected = selectedValue === value;

  return (
    <div
      className={clsx("select-box", selected && "selected", className)}
      onClick={() => onSelect(value)}
    >
      <div className="grow">{children}</div>
    </div>
  );
};
