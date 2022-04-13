import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import React from "react";

export const Title: React.FC<Classes> = ({ className, children }) => (
  <h2 className={clsx("text-xl font-bold mb-4", className)}>{children}</h2>
);
