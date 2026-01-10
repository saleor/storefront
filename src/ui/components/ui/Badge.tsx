import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
				{
					"bg-primary text-primary-foreground": variant === "default",
					"bg-secondary text-secondary-foreground": variant === "secondary",
					"bg-destructive text-destructive-foreground": variant === "destructive",
					"border border-border text-foreground": variant === "outline",
				},
				className,
			)}
			{...props}
		/>
	);
}
