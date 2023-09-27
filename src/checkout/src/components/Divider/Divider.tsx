import clsx from "clsx";
import React from "react";
import { type Classes } from "@/checkout/src/lib/globalTypes";

export const Divider: React.FC<Classes> = ({ className }) => {
	const classes = clsx("divider", className);

	return <div className={classes} />;
};
