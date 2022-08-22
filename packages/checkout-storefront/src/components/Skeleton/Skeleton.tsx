import { Classes } from "@/checkout-storefront/lib/globalTypes";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export interface SkeletonProps extends Classes {
  variant?: "paragraph" | "title";
}

export const Skeleton: React.FC<PropsWithChildren<SkeletonProps>> = ({
  children,
  className,
  variant = "paragraph",
}) => {
  const classes = clsx(
    "skeleton",
    { "mb-6 w-1/3": variant === "title", "h-3": variant === "paragraph" },
    className
  );

  return <div className={classes} children={children} />;
};
