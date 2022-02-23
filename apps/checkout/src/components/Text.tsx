import React from "react";
import clsx from "clsx";

export interface TextProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "secondary" | "tertiary" | "error";
  variant?: "title";
  bold?: boolean;
  className?: string;
  ariaLabel?: string;
  labeledBy?: string;
  id?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  size,
  color,
  bold,
  variant,
  className,
  ariaLabel,
  labeledBy,
  id,
}) => {
  const classes = clsx(
    "text",
    {
      "text-text-primary": !color,
      "text-text-secondary": color === "secondary",
      "text-text-tertiary": color === "tertiary",
      "text-error": color === "error",
      "text-sm": size === "sm",
      "text-base": !size,
      "text-md": size === "md",
      "text-lg": size === "lg",
      "text-xl": size === "xl" || variant === "title",
      "font-bold": bold || variant === "title",
    },
    className
  );

  const textProps = {
    className: classes,
    "aria-label": ariaLabel,
    "labeled-by": labeledBy,
    id: id,
  };

  if (size === "xl" || size === "lg") {
    return <h2 {...textProps}>{children}</h2>;
  }

  return <p {...textProps}>{children}</p>;
};
