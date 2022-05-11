import { ReactNode } from "react";
import clsx from "clsx";
import { Combobox } from "@headlessui/react";

import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";
import { ClassNames } from "@lib/globalTypes";

export interface Option<TData extends string = string> {
  label: string | ReactNode;
  value: TData;
  icon?: string | ReactNode;
  [key: string]: unknown;
}

export type SelectOnChangeHandler<TData extends string = string> = (
  value: TData
) => void;

export interface SelectProps<TData extends string = string> {
  options: Option<TData>[];
  selectedValue: string;
  error?: boolean;
  disabled?: boolean;
  classNames?: ClassNames<
    | "container"
    | "triggerIcon"
    | "trigger"
    | "triggerArrow"
    | "options"
    | "optionIcon"
    | "option"
  >;
  onChange: SelectOnChangeHandler<TData>;
}

export const Select = <TData extends string = string>({
  selectedValue,
  options,
  error,
  disabled,
  classNames,
  onChange,
}: SelectProps<TData>) => {
  const selectedOption = options.find(({ value }) => value === selectedValue);

  return (
    <div className={clsx(styles.container, classNames?.container)}>
      <Combobox
        value={selectedOption}
        onChange={({ value }: Option<TData>) => onChange(value)}
      >
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
                  <div
                    className={clsx(
                      styles["trigger-icon"],
                      classNames?.triggerIcon
                    )}
                  >
                    {selectedOption?.icon}
                  </div>
                )}
                {selectedOption?.label}
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
                className={clsx(styles.option, classNames?.option)}
              >
                {option?.icon && (
                  <div
                    className={clsx(
                      styles["option-icon"],
                      classNames?.optionIcon
                    )}
                  >
                    {option?.icon}
                  </div>
                )}
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  );
};
