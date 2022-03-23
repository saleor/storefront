import React, { BaseSyntheticEvent } from "react";
import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { Text } from "@components/Text";
import clsx from "clsx";
import { Classes } from "@lib/globalTypes";
import { AriaButtonProps } from "@react-types/button";

export interface ButtonProps extends AriaButtonProps<"button">, Classes {
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  title: string;
  onClick: (event: BaseSyntheticEvent<HTMLButtonElement>) => any;
  ariaLabel: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  className,
  variant = "primary",
  disabled = false,
  onClick,
  ariaLabel,
  ...rest
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(rest, ref);

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
      {...buttonProps}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      ref={ref}
      aria-label={ariaLabel}
    >
      <Text weight="semibold">{title}</Text>
    </button>
  );
};
