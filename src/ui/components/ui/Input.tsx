import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * shadcn/ui Input component.
 * Base input with consistent styling across the app.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-white px-3 py-2",
				"text-base ring-offset-background",
				"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
				"placeholder:text-muted-foreground",
				"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				// Prevent iOS zoom on focus (needs 16px minimum)
				"md:text-sm",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

Input.displayName = "Input";
