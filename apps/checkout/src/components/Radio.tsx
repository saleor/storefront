import React, { cloneElement, ReactNode } from "react";
import { Text } from "@components/Text";
import clsx from "clsx";

export interface RadioOption {
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  value: string;
  title?: string;
  subtitle?: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface RadioOptionContentProps {
  htmlFor: string;
}

export const Radio: React.FC<RadioOption> = ({
  value,
  title,
  subtitle,
  content,
  selectedValue,
  onSelect,
  disabled,
}) => (
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
      {title ? (
        <label htmlFor={value} className="radio-label">
          <Text className={clsx(disabled && "text-text-secondary")}>
            {title}
          </Text>
          {subtitle && <Text>{subtitle}</Text>}
        </label>
      ) : (
        // @ts-ignore to be removed after this is moved to ui kit
        cloneElement(content, { htmlFor: value })
      )}
    </div>
  </>
);
