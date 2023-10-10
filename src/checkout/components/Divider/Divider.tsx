import clsx from "clsx";
import React from "react";
import { type Classes } from "@/checkout/lib/globalTypes";

export const Divider: React.FC<Classes> = ({ className }) => {
	const classes = clsx("border-gray-200 h-px w-full border-t", className);

	return <div className={classes} />;
};
