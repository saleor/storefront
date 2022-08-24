import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Classes } from "../lib/globalTypes";

interface SelectBoxGroupProps extends Classes {
  label: string;
}

export const SelectBoxGroup: React.FC<PropsWithChildren<SelectBoxGroupProps>> = ({
  label,
  children,
  className,
}) => {
  return (
    <div role="radiogroup" aria-label={label} className={clsx(className)}>
      {children}
    </div>
  );
};
