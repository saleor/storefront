import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	loading?: boolean;
	children: ReactNode;
	fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ 
		variant = "primary", 
		size = "md", 
		loading = false, 
		children, 
		className, 
		disabled, 
		fullWidth = false,
		...props 
	}, ref) => {
		const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
		
		const variantClasses = {
			primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
			secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500",
			ghost: "text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500",
			danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
		};
		
		const sizeClasses = {
			sm: "px-3 py-1.5 text-sm rounded-md",
			md: "px-4 py-2 text-sm rounded-md",
			lg: "px-6 py-3 text-base rounded-lg",
		};
		
		return (
			<button
				ref={ref}
				className={clsx(
					baseClasses,
					variantClasses[variant],
					sizeClasses[size],
					fullWidth && "w-full",
					className
				)}
				disabled={disabled || loading}
				{...props}
			>
				{loading && (
					<div className="mr-2">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					</div>
				)}
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";