import { Ref, ReactNode, InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

import styles from "./Radio.module.css";
import { Label } from "../Label";
import { ClassNames } from "@lib/globalTypes";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string | ReactNode;
  classNames?: ClassNames<
    "container" | "inputContainer" | "input" | "radio" | "label"
  >;
}

export const Radio = forwardRef(
  (
    { label, checked, value, classNames, ...rest }: RadioProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const id = rest?.id || useId();

    return (
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
        {label && (
          <Label className={clsx(classNames?.label)} htmlFor={id}>
            {label}
          </Label>
        )}
      </div>
    );
  }
);
