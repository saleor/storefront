import { type AllHTMLAttributes } from "react";
import clsx from "clsx";
import { useField } from "@/checkout/hooks/useForm/useField";

export interface TextInputProps<TName extends string> extends AllHTMLAttributes<HTMLInputElement> {
	name: TName;
	label: string;
}

export const TextInput = <TName extends string>({
	name,
	label,
	required,
	...props
}: TextInputProps<TName>) => {
	const { error, ...fieldProps } = useField(name);

	return (
		<div>
			<label className="block">
				<span className="text-slate-700">
					{label}
					{required && "*"}
				</span>
				<input
					className={clsx(
						"mt-1 block w-full appearance-none rounded-md border-slate-300 shadow-sm transition-colors focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 active:border-indigo-200 active:outline-none",
						{ "border-red-300": error },
					)}
					required={required}
					spellCheck={false}
					{...fieldProps}
					{...props}
				/>
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
