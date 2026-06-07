import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "default" | "secondary" | "outline-solid" | "ghost" | "destructive";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

type ButtonClassNameOptions = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Use on `<a>` / `<Link>` with `aria-disabled` instead of native `disabled`. */
	asLink?: boolean;
	className?: string;
};

/** Disabled styles for links that use `aria-disabled` instead of the `disabled` attribute. */
export const ariaDisabledClassName = "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed";

/** Shared button styles for `<button>` and token-backed link CTAs. */
export function buttonClassName({
	variant = "default",
	size = "default",
	asLink = false,
	className,
}: ButtonClassNameOptions = {}) {
	const disabledClassName =
		variant === "default"
			? asLink
				? cn(
						ariaDisabledClassName,
						"aria-disabled:bg-muted aria-disabled:text-muted-foreground aria-disabled:shadow-none hover:aria-disabled:bg-muted",
					)
				: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none hover:disabled:bg-muted"
			: asLink
				? cn(ariaDisabledClassName, "aria-disabled:opacity-50")
				: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

	return cn(
		"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
		"transition-all duration-200",
		"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		disabledClassName,
		{
			"hover:bg-primary/90 shadow-xs bg-primary text-primary-foreground": variant === "default",
			"hover:bg-secondary/80 bg-secondary text-secondary-foreground": variant === "secondary",
			"shadow-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground":
				variant === "outline-solid",
			"hover:bg-accent hover:text-accent-foreground": variant === "ghost",
			"hover:bg-destructive/90 shadow-xs bg-destructive text-destructive-foreground":
				variant === "destructive",
		},
		{
			"h-10 px-4 py-2 text-sm": size === "default",
			"h-9 px-3 text-sm": size === "sm",
			"h-14 px-8 text-base": size === "lg",
			"h-10 w-10 p-0": size === "icon",
		},
		className,
	);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", ...props }, ref) => {
		return <button ref={ref} className={buttonClassName({ variant, size, className })} {...props} />;
	},
);

Button.displayName = "Button";
