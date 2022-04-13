import { PropsWithChildren } from "react";

interface RadioGroupProps {
  label: string;
}

export const RadioGroup: React.FC<PropsWithChildren<RadioGroupProps>> = ({
  label,
  children,
}) => {
  return <div className="radio-group">{children}</div>;
};
