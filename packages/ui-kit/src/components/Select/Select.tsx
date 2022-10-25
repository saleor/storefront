import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  ReactNode,
  SelectHTMLAttributes,
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
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Option<TData>[];
  classNames?: ClassNames<"container">;
}

const SelectComponent = <TData extends string = string>(
  { options, classNames, placeholder = "", onChange, ...rest }: SelectProps<TData>,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  const [showPlaceholder, setShowPlaceholder] = useState(!!placeholder);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if ((event.target as HTMLSelectElement).value === PLACEHOLDER_KEY) {
      return;
    }

    setShowPlaceholder(false);
    onChange(event);
  };

  return (
    <div className={clsx(styles.container, classNames?.container)}>
      <select
        {...rest}
        onChange={handleChange}
        defaultValue={showPlaceholder ? "" : undefined}
        ref={ref}
        className={clsx(styles.select)}
      >
        {showPlaceholder && (
          <option disabled value="">
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
