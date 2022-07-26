import React, { PropsWithChildren } from "react";
import clsx from "clsx";

export interface SelectBoxProps {
  value: string;
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
}

export const SelectBox: React.FC<PropsWithChildren<SelectBoxProps>> = ({
  children,
  value,
  onSelect,
  selectedValue,
}) => {
  const selected = selectedValue === value;

  return (
    <div className={clsx("select-box", selected && "selected")} onClick={() => onSelect(value)}>
      <div className="grow">{children}</div>
    </div>
  );
};
