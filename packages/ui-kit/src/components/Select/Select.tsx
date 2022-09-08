import { ForwardedRef, forwardRef, ReactNode, SelectHTMLAttributes, SyntheticEvent } from "react";
import clsx from "clsx";

import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";
import { ClassNames } from "@lib/globalTypes";

export interface Option<TData extends string = string> {
  label: string | ReactNode;
  value: TData;
  disabled?: boolean;
  icon?: string | ReactNode;
  [key: string]: unknown;
}

export type SelectOnChangeHandler<TData extends string = string> = (value: TData) => void;

export interface SelectProps<TData extends string = string>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  onChange: (event: SyntheticEvent) => void;
  options: Option<TData>[];
  classNames?: ClassNames<
    "container" | "triggerIcon" | "trigger" | "triggerArrow" | "options" | "optionIcon" | "option"
  >;
}

export const Select = forwardRef(
  <TData extends string = string>(
    { options, classNames, placeholder = "", value, ...rest }: SelectProps<TData>,
    ref: ForwardedRef<HTMLSelectElement>
  ) => {
    return (
      <div className={clsx(styles.container, classNames?.container)}>
        <select {...rest} ref={ref} className={clsx(styles.select)}>
          {options.map(({ label, value, disabled = false }) => (
            <option value={value} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>
        <div className={clsx(styles.icon)}>
          <ChevronDownIcon />
        </div>
      </div>
    );
  }
);
