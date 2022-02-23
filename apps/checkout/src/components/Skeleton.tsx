import clsx from "clsx";
import React from "react";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ children, className }) => {
  if (children) return <>{children}</>;

  const classes = clsx("min-h-3", "w-full", "bg-skeleton", className);

  return <div className={classes} />;
};

export default Skeleton;
