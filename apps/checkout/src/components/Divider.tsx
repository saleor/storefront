import clsx from "clsx";
import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  const classes = clsx("h-px w-full bg-border-primary", className);

  return <div className={classes} />;
};

export default Divider;
