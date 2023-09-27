import { type FC, type ReactNode, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonLabelProps {
	content: string;
	className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string | ReactNode;
	variant?: "primary" | "secondary" | "tertiary";
}

export const ButtonLabel: FC<ButtonLabelProps> = ({ content, ...rest }) => (
	<span className="font-semibold" {...rest}>
		{content}
	</span>
);

export const Button: FC<ButtonProps> = ({
	label,
	className,
	variant = "primary",
	disabled = false,
	children: _children,
	type = "button",
	...rest
}) => {
	const classes = clsx(
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border py-2 active:outline-none",
		{
			"bg-slate-400 hover:bg-slate-300 hover:border-slate-600 active:bg-slate-300 disabled:border-none disabled:bg-slate-200":
				variant === "primary",
			"border-slate-600 hover:border-slate-700 hover:bg-slate-300 active:bg-slate-300 disabled:border-slate-300 bg-transparent disabled:bg-transparent":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0": variant === "tertiary",
		},
		className,
	);

	return (
		<button disabled={disabled} className={classes} type={type === "submit" ? "submit" : "button"} {...rest}>
			{typeof label === "string" ? <ButtonLabel content={label} /> : label}
		</button>
	);
};
