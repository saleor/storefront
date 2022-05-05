import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { Classes } from "@/lib/globalTypes";

export interface TextProps extends Classes {
  size?: "sm" | "md" | "lg";
  color?: "secondary" | "tertiary" | "error" | "success";
  weight?: "normal" | "regular" | "semibold" | "bold";
  className?: string;
  ariaLabel?: string;
  labeledBy?: string;
}

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,
  size,
  color,
  weight,
  className,
  ariaLabel,
  labeledBy,
}) => {
  const classes = clsx(
    "text",
    {
      "text-text-primary": !color,
      "text-text-secondary": color === "secondary",
      "text-text-tertiary": color === "tertiary",
      "text-error": color === "error",
      "text-success": color === "success",
      "text-sm": size === "sm",
      "text-base": !size,
      "text-md": size === "md",
      "text-lg": size === "lg",
      "font-bold": weight === "bold",
      "font-semibold": weight === "semibold",
      "font-regular": weight === "regular",
    },
    className
  );

  return (
    <p className={classes} aria-label={ariaLabel} labeled-by={labeledBy}>
      {children}
    </p>
  );
};
