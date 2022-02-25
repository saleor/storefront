import React, { ElementType } from "react";
import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { Text } from "@components/Text";
import { AriaButtonProps } from "@react-types/button";
import clsx from "clsx";
import { Classes } from "@lib/globalTypes";

interface ButtonProps
  extends AriaButtonProps<ElementType<HTMLButtonElement>>,
    Classes {
  disabled?: boolean;
  variant?: "primary" | "secondary";
  title: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  className,
  variant = "primary",
  disabled = false,
  ...rest
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(rest, ref);

  const classes = clsx(
    "button",
    {
      "button-primary": variant === "primary",
      "button-secondary": variant === "secondary",
    },
    className
  );

  return (
    <button {...buttonProps} disabled={disabled} className={classes} ref={ref}>
      <Text>{title}</Text>
    </button>
  );
};

export default Button;
