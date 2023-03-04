import { ReactNode, InputHTMLAttributes, useId } from "react";
import clsx from "clsx";

import styles from "./Checkbox.module.css";
import { CheckIcon } from "../icons";
import { Label } from "../Label";
import { ClassNames } from "@lib/globalTypes";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string | ReactNode;
  classNames?: ClassNames<"container" | "inputContainer" | "input" | "checkbox" | "label">;
}

export const Checkbox = ({ label, checked, value, classNames, ...rest }: CheckboxProps) => {
  const generatedId = useId();
  const id = rest?.id || generatedId;

  return (
    <Label className={clsx(styles.label, classNames?.label)} htmlFor={id}>
      <>
        <div className={clsx(styles.checkbox, classNames?.container)}>
          <div className={clsx(styles["box"], "select-none")}>
            <input
              {...rest}
              type="checkbox"
              value={value}
              checked={!!checked}
              id={id}
              className={classNames?.input}
            />
            <div className={clsx(styles["checkbox-input"], classNames?.checkbox)}>
              <CheckIcon />
            </div>
          </div>
          <span className="pointer-events-none">{label && label}</span>
        </div>
      </>
    </Label>
  );
};
