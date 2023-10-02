import clsx from "clsx";
import { type HTMLAttributes } from "react";
import { useField } from "formik";
import { type Children, type Classes } from "@/checkout/lib/globalTypes";
import { useFormContext } from "@/checkout/hooks/useForm";

export interface SelectBoxProps<TFieldName extends string>
	extends Classes,
		Children,
		Omit<HTMLAttributes<HTMLInputElement>, "children"> {
	disabled?: boolean;
	name: TFieldName;
	value: string;
}

export const SelectBox = <TFieldName extends string>({
	children,
	className,
	disabled = false,
	name,
	value,
	id,
}: SelectBoxProps<TFieldName>) => {
	// normally we pass value which is sufficient as an id but in case of doubled forms
	// such as shipping addresses and billing addresses etc. we need to pass a unique id
	const identifier = id || value;
	const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
	const [field] = useField(name);
	const selected = values[name] === value;

	return (
		<div
			className={clsx(
				"relative mb-2 flex cursor-pointer flex-row items-center justify-start rounded border border-slate-400 px-3 py-2",
				"hover:border hover:border-slate-500",
				{ "border border-slate-500": selected, "pointer-events-none hover:border-slate-400": disabled },
				className,
			)}
		>
			<input
				type="radio"
				{...field}
				onChange={handleChange}
				value={value}
				checked={selected}
				id={identifier}
			/>
			<label className="w-full cursor-pointer" htmlFor={identifier}>
				{children}
			</label>
		</div>
	);
};
