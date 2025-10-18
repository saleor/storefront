import { type SelectHTMLAttributes, type ChangeEvent, type ReactNode, useState } from "react";
import clsx from "clsx";
import { AlertCircleIcon } from "lucide-react";
import { useField } from "@/checkout/hooks/useForm/useField";

export interface Option<TData extends string = string> {
	label: ReactNode;
	value: TData;
	disabled?: boolean;
	icon?: ReactNode;
	[key: string]: unknown;
}

interface SelectProps<TName extends string, TData extends string>
	extends SelectHTMLAttributes<HTMLSelectElement> {
	name: TName;
	placeholder?: TName;
	label?: ReactNode;
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
	options: Option<TData>[];
	helpText?: string;
}

export const Select = <TName extends string, TData extends string>({
	name,
	placeholder,
	onChange,
	options,
	label,
	helpText,
	required,
	...rest
}: SelectProps<TName, TData>) => {
	const { error, handleBlur, value, ...fieldProps } = useField(name);

	const [showPlaceholder, setShowPlaceholder] = useState(!!placeholder);
	const hasValue = value && String(value).trim().length > 0;

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		if (!event.currentTarget.value) {
			return;
		}

		setShowPlaceholder(false);
		onChange?.(event);
		fieldProps.onChange(event);
	};

	return (
		<div className="space-y-1">
			<label className="flex flex-col">
				{label && (
					<span className="mb-1 flex items-center gap-1 text-xs font-medium text-base-200">
						{label}
						{required && <span className="text-red-400" aria-label="required">*</span>}
					</span>
				)}
				<select
					{...fieldProps}
					{...rest}
					value={value}
					required={required}
					onBlur={handleBlur}
					onChange={handleChange}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
					className={clsx(
						"w-full appearance-none rounded-md border px-3 py-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
						{
							// Error state - dark theme with high contrast
							"border-red-700 bg-red-950 text-red-100 focus:border-red-500 focus:ring-red-500": error,
							// Success state - dark theme
							"border-green-700 bg-green-950 text-green-100 focus:border-green-500 focus:ring-green-500": !error && required && hasValue,
							// Default state - dark theme matching checkout forms
							"border-base-700 bg-base-950 text-white focus:border-accent-500 focus:ring-accent-500": !error && (!required || !hasValue),
						},
					)}
				>
					{showPlaceholder && (
						<option disabled value="" className="text-base-500">
							{placeholder}
						</option>
					)}
					{options.map(({ label, value, disabled = false }) => (
						<option value={value} disabled={disabled} key={label?.toString() + "_" + value}>
							{label}
						</option>
					))}
				</select>
			</label>
			{error && (
				<div id={`${name}-error`} className="flex items-start gap-1.5 text-sm text-red-400" role="alert">
					<AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{!error && helpText && (
				<p id={`${name}-help`} className="text-xs text-base-400">
					{helpText}
				</p>
			)}
		</div>
	);
};
