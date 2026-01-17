import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * shadcn/ui Label component.
 * Accessible label for form inputs.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
	return (
		<label
			ref={ref}
			className={cn(
				"text-sm font-medium leading-none",
				"peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className,
			)}
			{...props}
		/>
	);
});

Label.displayName = "Label";
