// import {useCheckbox} from '@react-aria/checkbox' -> won't work now because of React 18, add after official release

import { Label } from "@components/Label";
import { CheckIcon } from "@icons";
import { Classes } from "@lib/globalTypes";
import clsx from "clsx";

interface CheckboxProps extends Classes {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  // TMP until react aria checkbox works
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  value,
  onChange,
  className,
  id,
}) => {
  return (
    <div className={clsx("checkbox", className)}>
      <div className="relative h-5 w-5 mr-2">
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
