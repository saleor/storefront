import { FC, ReactNode } from "react";
import clsx from "clsx";
import { Combobox } from "@headlessui/react";

import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";
import { ClassNames } from "@lib/globalTypes";

interface Option {
  label: string | ReactNode;
  id: string;
  value: string;
  icon?: string | ReactNode;
  [key: string]: unknown;
}

export interface SelectProps {
  options: Option[];
  selected: Option;
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
  onChange?: (option: Option) => void;
}

export const Select: FC<SelectProps> = ({
  selected,
  options,
  error,
  disabled,
  classNames,
  onChange,
}) => {
  return (
    <div className={clsx(styles.container, classNames?.container)}>
      <Combobox value={selected} onChange={onChange as any}>
        <Combobox.Button
          className={clsx(
            styles.trigger,
            {
              [styles["trigger-error"]]: error,
              [styles["trigger-disabled"]]: disabled,
            },
            classNames?.trigger
          )}>
          {({ open }) => {
            return (
              <>
                {selected?.icon && (
                  <div
                    className={clsx(
                      styles["trigger-icon"],
                      classNames?.triggerIcon
                    )}>
                    {selected?.icon}
                  </div>
                )}
                {selected?.label}
                {!disabled && (
                  <span
                    className={clsx(
                      styles["arrow-container"],
                      {
                        [styles["arrow-container-open"]]: open,
                      },
                      classNames?.triggerArrow
                    )}>
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
                key={option.id}
                value={option}
                className={clsx(styles.option, classNames?.option)}>
                {option?.icon && (
                  <div
                    className={clsx(
                      styles["option-icon"],
                      classNames?.optionIcon
                    )}>
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
