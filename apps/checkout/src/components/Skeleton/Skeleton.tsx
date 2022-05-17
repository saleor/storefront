import { Classes } from "@/lib/globalTypes";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import "./SkeletonStyles.css";

export interface SkeletonProps extends Classes {
  variant?: "paragraph" | "title";
}

export const Skeleton: React.FC<PropsWithChildren<SkeletonProps>> = ({
  children,
  className,
  variant = "paragraph",
}) => {
  if (children) return <>{children}</>;

  const classes = clsx(
    "skeleton",
    { "h-5 mb-6": variant === "title", "h-3": variant === "paragraph" },
    className
  );

  return <div className={classes} />;
};
