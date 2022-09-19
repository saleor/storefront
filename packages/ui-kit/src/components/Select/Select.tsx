import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  SelectHTMLAttributes,
  SyntheticEvent,
  useState,
} from "react";
import clsx from "clsx";

import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";
import { ClassNames } from "@lib/globalTypes";

const PLACEHOLDER_KEY = "placeholder";

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
  classNames?: ClassNames<"container">;
  width?: "1/2" | "full";
}

const SelectComponent = <TData extends string = string>(
  { options, classNames, placeholder = "", width = "full", onChange, ...rest }: SelectProps<TData>,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  const [showPlaceholder, setShowPlaceholder] = useState(!!placeholder);

  const handleChange = (event: SyntheticEvent) => {
    if ((event.target as HTMLSelectElement).value === PLACEHOLDER_KEY) {
      return;
    }

    setShowPlaceholder(false);
    onChange(event);
  };

  return (
    <div
      className={clsx(
        styles.container,
        classNames?.container,
        width === "1/2" ? "w-1/2" : "w-full"
      )}
    >
      <select onChange={handleChange} {...rest} ref={ref} className={clsx(styles.select)}>
        {showPlaceholder && (
          <option disabled selected value="">
            {placeholder}
          </option>
        )}
        {options.map(({ label, value, disabled = false }) => (
          <option value={value} disabled={disabled} key={value}>
            {label}
          </option>
        ))}
      </select>
      <div className={clsx(styles.icon)}>
        <ChevronDownIcon />
      </div>
    </div>
  );
};

export const Select = forwardRef(SelectComponent);
