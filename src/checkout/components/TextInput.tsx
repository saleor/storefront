import { type AllHTMLAttributes } from "react";
import clsx from "clsx";
import { Field, type FieldProps } from "formik";
import { AlertCircleIcon } from "lucide-react";

export interface TextInputProps<TName extends string> extends AllHTMLAttributes<HTMLInputElement> {
	name: TName;
	label: string;
	helpText?: string;
}

export const TextInput = <TName extends string>(props: TextInputProps<TName>) => (
	<Field {...props} component={TextInputComponent} />
);

export const TextInputComponent = <TName extends string>({
	field,
	form: { touched, errors },
	label,
	required,
	helpText,
	...props
}: TextInputProps<TName> & FieldProps) => {
	const error = touched[field.name] ? (errors[field.name] as string) : undefined;
	const hasValue = field.value != null && String(field.value).trim().length > 0;
	const isTouched = touched[field.name] as boolean | undefined;

	return (
		<div className="space-y-1">
			<label className="flex flex-col">
				<span className="mb-1 flex items-center gap-1 text-xs font-medium text-base-200">
					{label}
					{required && <span className="text-red-400" aria-label="required">*</span>}
				</span>
				<input
					required={required}
					spellCheck={false}
					{...field}
					{...props}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${field.name}-error` : helpText ? `${field.name}-help` : undefined}
					className={clsx(
						"w-full appearance-none rounded-md border px-3 py-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
						{
							// Error state - dark theme with high contrast
							"border-red-700 bg-red-950 text-red-100 placeholder-red-400 focus:border-red-500 focus:ring-red-500": error,
							// Success state (valid value entered for required field) - dark theme
							"border-green-700 bg-green-950 text-green-100 focus:border-green-500 focus:ring-green-500": !error && required && hasValue && isTouched,
							// Default state - dark theme matching checkout forms
							"border-base-700 bg-base-950 text-white placeholder-base-500 focus:border-accent-500 focus:ring-accent-500": !error && (!required || !hasValue || !isTouched),
						},
						props.className,
					)}
				/>
			</label>
			{error && (
				<div id={`${field.name}-error`} className="flex items-start gap-1.5 text-sm text-red-400" role="alert">
					<AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{!error && helpText && (
				<p id={`${field.name}-help`} className="text-xs text-base-400">
					{helpText}
				</p>
			)}
		</div>
	);
};
