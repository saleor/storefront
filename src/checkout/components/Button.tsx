import { type FC, type ReactNode, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: ReactNode;
	variant?: "primary" | "secondary" | "tertiary";
	ariaLabel?: string;
	ariaDisabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
	label,
	className,
	variant = "primary",
	disabled = false,
	children: _children,
	type = "button",
	ariaLabel,
	ariaDisabled,
	...rest
}) => {
	const classes = clsx(
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border active:outline-none",
		{
			"bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-700 aria-disabled:bg-neutral-200 text-white px-4":
				variant === "primary",
			"border-neutral-600 hover:border-neutral-700 hover:bg-neutral-300 active:bg-neutral-300 disabled:border-neutral-300 aria-disabled:border-neutral-300 bg-transparent disabled:bg-transparent aria-disabled:bg-transparent":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0": variant === "tertiary",
		},
		className,
	);

	return (
		<button
			aria-label={ariaLabel}
			aria-disabled={ariaDisabled}
			disabled={disabled}
			className={classes}
			type={type === "submit" ? "submit" : "button"}
			{...rest}
		>
			{typeof label === "string" ? <span className="font-semibold">{label}</span> : label}
		</button>
	);
};
