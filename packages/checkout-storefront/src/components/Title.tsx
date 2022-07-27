import { Classes } from "@/checkout-storefront/lib/globalTypes";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export const Title: React.FC<PropsWithChildren<Classes>> = ({ className, children }) => (
  <h2 className={clsx("text-text-primary text-xl font-bold mb-4", className)}>{children}</h2>
);
