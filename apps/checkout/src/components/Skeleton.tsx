import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import React from "react";

const Skeleton: React.FC<Classes> = ({ children, className }) => {
  if (children) return <>{children}</>;

  const classes = clsx("min-h-3", "w-full", "bg-skeleton", className);

  return <div className={classes} />;
};

export default Skeleton;
