"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	/** Controlled checked state */
	checked?: boolean;
	/** Callback when checked state changes */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * shadcn/ui style Checkbox component.
 * Custom styled checkbox with check icon.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(e);
			onCheckedChange?.(e.target.checked);
		};

		return (
			<div className="relative inline-flex items-center">
				<input
					type="checkbox"
					ref={ref}
					checked={checked}
					onChange={handleChange}
					className="peer sr-only"
					{...props}
				/>
				<div
					className={cn(
						"flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
						"border-input ring-offset-background",
						"peer-focus-visible:outline-hidden peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
						"peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
						checked
							? "border-foreground bg-foreground text-background"
							: "border-muted-foreground/50 bg-background",
						className,
					)}
					aria-hidden="true"
				>
					{checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
				</div>
			</div>
		);
	},
);

Checkbox.displayName = "Checkbox";
