import clsx from "clsx";
import { Children, Classes } from "@/checkout-storefront/lib/globalTypes";
import { FC } from "react";

export interface SelectBoxProps extends Classes, Children {
  value: string;
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  disabled?: boolean;
}

export const SelectBox: FC<SelectBoxProps> = ({
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
    <div className={clsx("select-box", { selected, disabled }, className)} onClick={handleClick}>
      <div className="grow">{children}</div>
    </div>
  );
};
