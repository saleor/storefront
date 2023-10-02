import { type AllHTMLAttributes } from "react";
import clsx from "clsx";
import { Field, type FieldProps } from "formik";

export interface TextInputProps<TName extends string> extends AllHTMLAttributes<HTMLInputElement> {
	name: TName;
	label: string;
}

export const TextInput = <TName extends string>(props: TextInputProps<TName>) => (
	<Field {...props} component={TextInputComponent} />
);

export const TextInputComponent = <TName extends string>({
	field,
	form: { touched, errors },
	label,
	required,
	...props
}: TextInputProps<TName> & FieldProps) => {
	const error = touched[field.name] ? (errors[field.name] as string) : undefined;

	return (
		<div>
			<label className="block">
				<span className="text-xs text-slate-700">
					{label}
					{required && "*"}
				</span>
				<input
					required={required}
					spellCheck={false}
					{...field}
					{...props}
					className={clsx(
						"mt-0.5 block w-full appearance-none rounded-md border-slate-300 shadow-sm transition-colors focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 active:border-indigo-200 active:outline-none",
						{ "border-red-300": error },
						props.className,
					)}
				/>
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
