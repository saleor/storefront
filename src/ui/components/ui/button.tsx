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
	className?: string;
};

/** Shared button styles for `<button>` and token-backed link CTAs. */
export function buttonClassName({
	variant = "default",
	size = "default",
	className,
}: ButtonClassNameOptions = {}) {
	return cn(
		"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
		"transition-all duration-200",
		"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		"disabled:pointer-events-none disabled:opacity-50",
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
