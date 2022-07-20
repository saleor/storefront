import { PropsWithChildren } from "react";

interface RadioBoxGroupProps {
  label: string;
}

export const RadioBoxGroup: React.FC<PropsWithChildren<RadioBoxGroupProps>> = ({
  label,
  children,
}) => {
  return (
    <div role="radiogroup" aria-label={label} className="radio-box-group">
      {children}
    </div>
  );
};
