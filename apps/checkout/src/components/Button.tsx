import React from "react";
import { Text } from "@components/Text";
import clsx from "clsx";
import { Classes } from "@lib/globalTypes";
import { AriaButtonProps } from "@react-types/button";
import { SyntheticEvent } from "react";

export interface ButtonProps extends AriaButtonProps<"button">, Classes {
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  title: string;
  onClick: (event: SyntheticEvent<HTMLButtonElement>) => any;
  ariaLabel: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  className,
  variant = "primary",
  disabled = false,
  onClick,
  ariaLabel,
}) => {
  const classes = clsx(
    "button",
    {
      "button-primary": variant === "primary",
      "button-secondary": variant === "secondary",
      "button-tertiary": variant === "tertiary",
    },
    className
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      <Text weight="semibold">{title}</Text>
    </button>
  );
};
