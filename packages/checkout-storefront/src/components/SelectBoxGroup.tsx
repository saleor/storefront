import { PropsWithChildren } from "react";

interface SelectBoxGroupProps {
  label: string;
}

export const SelectBoxGroup: React.FC<
  PropsWithChildren<SelectBoxGroupProps>
> = ({ label, children }) => {
  return (
    <div role="radiogroup" aria-label={label}>
      {children}
    </div>
  );
};
