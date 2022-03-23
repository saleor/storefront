import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import React from "react";

interface LabelProps extends Classes {
  htmlFor: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  className,
}) => (
  <label
    htmlFor={htmlFor}
    className={clsx("text-text-primary text-base font-regular", className)}
  >
    {children}
  </label>
);
