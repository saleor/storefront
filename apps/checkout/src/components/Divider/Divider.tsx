import { Classes } from "@/checkout/lib/globalTypes";
import clsx from "clsx";
import React from "react";
import "./DividerStyles.css";

export const Divider: React.FC<Classes> = ({ className }) => {
  const classes = clsx("divider", className);

  return <div className={classes} />;
};
