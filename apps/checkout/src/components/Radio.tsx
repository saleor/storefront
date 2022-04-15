import React, { ReactNode } from "react";
import { Text } from "@/components/Text";
import clsx from "clsx";

export interface RadioOptionBase {
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  value: string;
  disabled?: boolean;
}

export type RadioChildren = (
  props: Pick<RadioOptionChildrenProps, "htmlFor">
) => ReactNode;

export interface CustomRadioOption extends RadioOptionBase {
  children: RadioChildren;
  title?: never;
  subtitle?: never;
}

export interface SimpleRadioOption extends RadioOptionBase {
  title: string;
  subtitle?: string;
  children?: never;
}

export type RadioOption = SimpleRadioOption | CustomRadioOption;

export interface RadioOptionChildrenProps
  extends Pick<RadioOptionBase, "disabled"> {
  htmlFor: string;
}

export const Radio: React.FC<SimpleRadioOption | CustomRadioOption> = ({
  value,
  title,
  subtitle,
  children,
  selectedValue,
  onSelect,
  disabled,
}: RadioOption & {
  title?: string;
  subtitle?: string;
  children?: RadioChildren;
}) => {
  const isSimpleRadio = title && !children;
  const isCustomRadio = !title && children;

  return (
    <>
      <div
        className={clsx(
          "radio-option",
          disabled && "disabled",
          subtitle && "with-subtitle",
          { selected: selectedValue === value && !disabled }
        )}
      >
        <div
          className="radio-input-container"
          onClick={() => {
            if (!disabled) {
              onSelect(value);
            }
          }}
        >
          <input
            disabled={disabled}
            name={title}
            className="radio-input"
            id={value}
            checked={selectedValue === value}
          />
          <span className="radio-input-icon" />
        </div>
        {isSimpleRadio && (
          <label htmlFor={value} className="radio-label">
            <Text className={clsx(disabled && "text-text-secondary")}>
              {title}
            </Text>
            {subtitle && <Text>{subtitle}</Text>}
          </label>
        )}

        {isCustomRadio && children({ htmlFor: value })}
      </div>
    </>
  );
};
