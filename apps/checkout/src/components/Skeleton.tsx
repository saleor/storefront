import { Classes } from "@/lib/globalTypes";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export const Skeleton: React.FC<PropsWithChildren<Classes>> = ({
  children,
  className,
}) => {
  if (children) return <>{children}</>;

  const classes = clsx("min-h-3", "w-full", "bg-skeleton", className);

  return <div className={classes} />;
};
