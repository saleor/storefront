import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import React from "react";

export const Divider: React.FC<Classes> = ({ className }) => {
  const classes = clsx("divider", className);

  return <div className={classes} />;
};
