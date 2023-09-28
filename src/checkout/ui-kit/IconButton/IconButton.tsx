import { type FC, type ReactNode } from "react";
import clsx from "clsx";

import { Button, type ButtonProps, ButtonLabel } from "../Button/Button";
import { type HorizontalAlignment } from "..";

export interface IconButtonProps
	extends Omit<ButtonProps, "variant" | "label">,
		Partial<Pick<ButtonProps, "label">> {
	icon: ReactNode;
	alignment?: HorizontalAlignment;
	variant?: "bare";
}

export const IconButton: FC<IconButtonProps> = ({
	label,
	icon,
	className,
	variant,
	alignment = "left",
	...rest
}) => {
	if (variant === "bare") {
		return (
			<button
				type="button"
				className={clsx("bg-transparent text-slate-900 hover:text-slate-800", className)}
				{...rest}
			>
				{icon}
			</button>
		);
	}

	return (
		<Button
			label={
				<>
					{icon}
					{typeof label === "string" && (
						<ButtonLabel className={alignment === "right" ? "mr-1.5" : "ml-1.5"} content={label} />
					)}
				</>
			}
			variant="secondary"
			className={clsx(
				"inline-flex h-10 items-center py-2",
				{
					"flex-row-reverse": alignment === "right",
					"w-10 justify-center px-0": !label,
				},
				className,
			)}
			{...rest}
		/>
	);
};
