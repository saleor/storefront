import clsx from "clsx";
import { type InputHTMLAttributes } from "react";

import { type ClassNames } from "..";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "checked"> {
	label?: string;
	error?: string;
	classNames?: ClassNames<"container" | "input">;
}

export const TextInput = ({
	label,
	error,
	required,
	placeholder,
	value,
	classNames = {},
	type = "text",
	...rest
}: TextInputProps) => {
	const hasError = typeof error === "string";

	return (
		<div className={clsx("relative mb-3 w-full", classNames.container)}>
			<input
				className={clsx(
					"h-12 w-full appearance-none rounded border border-slate-600 py-3 pb-2 pt-5 text-base transition-colors focus:border-slate-700 focus:outline-none active:border-slate-600 active:outline-none",
					{
						"border-red-300": hasError,
						"h-10 py-[9px]": !label,
					},
					classNames.input,
				)}
				placeholder={placeholder}
				value={value}
				required={required}
				spellCheck={false}
				{...rest}
				type={type}
			/>
			{label && (
				<label
					className={clsx("text-input-label", {
						"text-input-filled-label": value || placeholder,
					})}
				>
					{label}
					{required && "*"}
				</label>
			)}
			{hasError && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
TextInput.displayName = "TextInput";
