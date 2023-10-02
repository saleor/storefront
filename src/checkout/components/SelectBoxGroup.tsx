import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { type Classes } from "../lib/globalTypes";

interface SelectBoxGroupProps extends Classes {
	label: string;
}

export const SelectBoxGroup: React.FC<PropsWithChildren<SelectBoxGroupProps>> = ({
	label,
	children,
	className,
}) => {
	return (
		<div role="radiogroup" aria-label={label} className={clsx(className, "grid gap-x-2 md:grid-cols-2")}>
			{children}
		</div>
	);
};
