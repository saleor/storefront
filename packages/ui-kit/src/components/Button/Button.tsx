import { FC, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Button.module.css";
import { Text } from "../Text";

interface ButtonLabelProps {
  content: string;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

export const ButtonLabel: FC<ButtonLabelProps> = ({ content, ...rest }) => (
  <Text as="span" weight="semibold" {...rest}>
    {content}
  </Text>
);

export const Button: FC<ButtonProps> = ({
  label,
  className,
  variant = "primary",
  disabled = false,
  children,
  type = "button",
  ...rest
}) => {
  const classes = clsx(
    styles.button,
    {
      [styles["button-primary"]]: variant === "primary",
      [styles["button-secondary"]]: variant === "secondary",
      [styles["button-tertiary"]]: variant === "tertiary",
    },
    className
  );

  return (
    <button disabled={disabled} className={classes} type={type} {...rest}>
      {typeof label === "string" ? <ButtonLabel content={label} /> : label}
    </button>
  );
};
