import clsx from "clsx";
import React, { type PropsWithChildren } from "react";
import { type Classes } from "@/checkout/lib/globalTypes";

export interface SkeletonProps extends Classes {
	variant?: "paragraph" | "title";
}

export const Skeleton: React.FC<PropsWithChildren<SkeletonProps>> = ({
	children,
	className,
	variant = "paragraph",
}) => {
	const classes = clsx(
		"bg-skeleton mb-2 h-3 min-w-[250px] rounded",
		{ "mb-6 w-1/3": variant === "title", "h-3": variant === "paragraph" },
		className,
	);

	return <div className={classes}>{children}</div>;
};
