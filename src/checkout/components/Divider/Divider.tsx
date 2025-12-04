import clsx from "clsx";
import type { FC } from "react";
import { type Classes } from "@/checkout/lib/globalTypes";

export const Divider: FC<Classes> = ({ className }) => {
	const classes = clsx("border-neutral-200 h-px w-full border-t", className);

	return <div className={classes} />;
};
