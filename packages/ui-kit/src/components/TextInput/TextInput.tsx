import { ClassNames } from "@lib/globalTypes";
import clsx from "clsx";
import { Children, InputHTMLAttributes, PropsWithChildren } from "react";

import { Label } from "../Label";
import { Text } from "../Text";

import styles from "./TextInput.module.css";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "checked"> {
  label?: string;
  error?: string;
  classNames?: ClassNames<"container" | "input">;
}

export const TextInput = ({
  label,
  error,
  required,
  placeholder,
  value,
  classNames = {},
  type = "text",
  ...rest
}: TextInputProps) => (
  <div className={clsx(styles["text-input-container"], classNames.container)}>
    <input
      className={clsx(
        styles["text-input"],
        {
          [styles["text-input-error"]]: !!error,
          [styles["text-input-nolabel"]]: !label,
        },
        classNames.input
      )}
      placeholder={placeholder}
      value={value}
      required={required}
      spellCheck={false}
      {...rest}
      type={type}
    />
    {label && (
      <Label
        className={clsx(styles["text-input-label"], {
          [styles["text-input-filled-label"]]: value || placeholder,
        })}
      >
        {label}
        {required && "*"}
      </Label>
    )}
    {error?.length && (
      <Text size="sm" color="error" className={styles["text-input-error-caption"]}>
        {error}
      </Text>
    )}
  </div>
);
