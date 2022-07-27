import { Ref, ReactNode, InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

import styles from "./Radio.module.css";
import { Label } from "../Label";
import { ClassNames } from "@lib/globalTypes";

export type RadioClassNames = ClassNames<
  "container" | "inputContainer" | "input" | "radio" | "label"
>;

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string | ReactNode;
  classNames?: RadioClassNames;
}

export const Radio = forwardRef(
  ({ label, checked, value, classNames, ...rest }: RadioProps, ref: Ref<HTMLInputElement>) => {
    const generatedId = useId();
    const id = rest?.id || generatedId;

    return (
      <Label className={clsx(styles.label, classNames?.label)} htmlFor={id}>
        <div className={clsx(styles.radio, classNames?.container)}>
          <div className={clsx(styles["box"])}>
            <input
              ref={ref}
              type="radio"
              value={value}
              checked={checked}
              id={id}
              className={classNames?.input}
              {...rest}
            />
            <div className={clsx(styles["radio-input"], classNames?.radio)} />
          </div>
          <div className="w-full flex justify-stretch ml-4">{label}</div>
        </div>
      </Label>
    );
  }
);
