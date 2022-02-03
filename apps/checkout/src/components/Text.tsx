import React from "react";
import clsx from "clsx";

export interface TextProps {
  size?: "sm" | "lg" | "xl";
  color?: "secondary" | "tertiary" | "error";
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({ children, size, color, bold }) => {
  const classes = clsx({
    "text-text-secondary": color === "secondary",
    "text-text-tertiary": color === "tertiary",
    "text-error": color === "error",
    "text-sm": size === "sm",
    "text-lg": size === "lg",
    "text-xl": size === "xl",
    "font-bold": bold,
  });

  if (size === "xl") {
    return <h2 className={classes}>{children}</h2>;
  }

  return <p className={classes}>{children}</p>;
};

export default Text;
