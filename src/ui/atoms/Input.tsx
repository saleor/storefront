import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, leftIcon, rightIcon, className, fullWidth = false, id, ...props }, ref) => {
		const generatedId = useId();
		const inputId = id || generatedId;

		const baseClasses =
			"block border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0";
		const stateClasses = error
			? "border-red-300 focus:border-red-500 focus:ring-red-500"
			: "border-secondary-300 focus:border-primary-500 focus:ring-primary-500";

		const paddingClasses = clsx("px-3 py-2", leftIcon ? "pl-10" : "", rightIcon ? "pr-10" : "");

		return (
			<div className={clsx("relative", fullWidth && "w-full")}>
				{label && (
					<label htmlFor={inputId} className="mb-1 block text-sm font-medium text-secondary-700">
						{label}
					</label>
				)}

				<div className="relative">
					{leftIcon && (
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<div className="h-5 w-5 text-secondary-400">{leftIcon}</div>
						</div>
					)}

					<input
						ref={ref}
						id={inputId}
						className={clsx(baseClasses, stateClasses, paddingClasses, fullWidth && "w-full", className)}
						{...props}
					/>

					{rightIcon && (
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<div className="h-5 w-5 text-secondary-400">{rightIcon}</div>
						</div>
					)}
				</div>

				{error && (
					<p className="mt-1 text-sm text-red-600" role="alert">
						{error}
					</p>
				)}

				{helperText && !error && <p className="mt-1 text-sm text-secondary-500">{helperText}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
