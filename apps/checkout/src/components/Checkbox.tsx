import { Label } from "@components/Label";
import { CheckIcon } from "@icons";
import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import { useId } from "react";

interface CheckboxProps extends Classes {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  value,
  onChange,
  className,
}) => {
  const id = useId();

  return (
    <div className={clsx("checkbox", className)}>
      <div className="relative icon mr-2">
        <input type="checkbox" value={value} checked={checked} id={id} />
        <div className="checkbox-input" onClick={() => onChange(!checked)}>
          <img alt="check icon" src={CheckIcon} />
        </div>
      </div>
      <Label className="checkbox-label" htmlFor={id}>
        {label}
      </Label>
    </div>
  );
};
