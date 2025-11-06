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
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border font-medium active:outline-none transition-all duration-200",
		{
			"bg-white hover:bg-accent-200 focus:bg-accent-200 text-black px-4 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 hover:aria-disabled:bg-white disabled:opacity-50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-black":
				variant === "primary",
			"border-2 border-accent-200 bg-transparent text-accent-100 hover:border-accent-300 hover:bg-accent-950 px-4 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-black aria-disabled:cursor-not-allowed aria-disabled:opacity-50":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0 text-white hover:text-accent-400": variant === "tertiary",
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
