import { ReactNode, SelectHTMLAttributes } from "react";
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
  options: Option<TData>[];
  error?: boolean;
  classNames?: ClassNames<"container" | "select">;
}

export const Select = <TData extends string = string>({
  options,
  error,
  classNames,
  placeholder = "",
  value,
  ...rest
}: SelectProps<TData>) => {
  return (
    <div className={clsx(styles.container, classNames?.container)}>
      <select {...rest} className={clsx(styles.select)}>
        {options.map(({ label, value, disabled = false }) => (
          <option value={value} disabled={disabled}>
            {label}
          </option>
        ))}
        <ChevronDownIcon />
      </select>
      {/* <Combobox value={selectedOption} onChange={({ value }: Option<TData>) => onChange(value)}>
        <Combobox.Button
          className={clsx(
            styles.trigger,
            {
              [styles["trigger-error"]]: error,
              [styles["trigger-disabled"]]: disabled,
            },
            classNames?.trigger
          )}
        >
          {({ open }) => {
            return (
              <>
                {selectedOption?.icon && (
                  <div className={clsx(styles["trigger-icon"], classNames?.triggerIcon)}>
                    {selectedOption?.icon}
                  </div>
                )}
                {selectedOption?.label || placeholder}
                {!disabled && (
                  <span
                    className={clsx(
                      styles["arrow-container"],
                      {
                        [styles["arrow-container-open"]]: open,
                      },
                      classNames?.triggerArrow
                    )}
                  >
                    <ChevronDownIcon />
                  </span>
                )}
              </>
            );
          }}
        </Combobox.Button>
        {!disabled && (
          <Combobox.Options className={clsx(styles.options)}>
            {options.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                disabled={option.disabled}
                className={clsx(
                  styles.option,
                  classNames?.option,
                  option.disabled && styles.disabled
                )}
              >
                {option?.icon && (
                  <div className={clsx(styles["option-icon"], classNames?.optionIcon)}>
                    {option?.icon}
                  </div>
                )}
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox> */}
    </div>
  );
};
