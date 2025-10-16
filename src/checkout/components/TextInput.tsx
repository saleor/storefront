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
				<span className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-700">
					{label}
					{required && <span className="text-red-500" aria-label="required">*</span>}
				</span>
				<input
					required={required}
					spellCheck={false}
					{...field}
					{...props}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${field.name}-error` : helpText ? `${field.name}-help` : undefined}
					className={clsx(
						"w-full appearance-none rounded-md border px-3 py-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2",
						{
							// Error state
							"border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-400 focus:ring-red-200": error,
							// Success state (valid value entered for required field)
							"border-green-300 bg-green-50 focus:border-green-400 focus:ring-green-200": !error && required && hasValue && isTouched,
							// Default state
							"border-neutral-300 bg-white focus:border-blue-400 focus:ring-blue-200": !error && (!required || !hasValue || !isTouched),
						},
						props.className,
					)}
				/>
			</label>
			{error && (
				<div id={`${field.name}-error`} className="flex items-start gap-1.5 text-sm text-red-600" role="alert">
					<AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{!error && helpText && (
				<p id={`${field.name}-help`} className="text-xs text-neutral-500">
					{helpText}
				</p>
			)}
		</div>
	);
};
