import clsx from "clsx";
import {
  FC,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  RefObject,
  useEffect,
  useState,
} from "react";

import { Label } from "../Label";
import { Text } from "../Text";

import styles from "./TextInput.module.css";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "checked"> {
  label?: string;
  error?: string;
}

export const TextInput: FC<TextInputProps> = ({
  label,
  error,
  required,
  placeholder,
  value,
  ...rest
}) => (
  <div className={clsx(styles["text-input-container"])}>
    {label && (
      <Label
        className={clsx(styles["text-input-label"], {
          [styles["text-input-filled-label"]]: value || placeholder,
        })}>
        {label}
        {required && "*"}
      </Label>
    )}
    <input
      className={clsx(styles["text-input"], {
        [styles["text-input-error"]]: error,
        [styles["text-input-nolabel"]]: !label,
      })}
      placeholder={placeholder}
      value={value}
      required={required}
      {...rest}
    />
    {error && (
      <Text
        size='sm'
        color='error'
        className={styles["text-input-error-caption"]}>
        {error}
      </Text>
    )}
  </div>
);
