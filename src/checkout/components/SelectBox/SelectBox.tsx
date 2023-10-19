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
}: SelectBoxProps<TFieldName>) => {
	const { values, handleChange } = useFormContext<Record<TFieldName, string>>();
	const [field] = useField(name);
	const selected = values[name] === value;

	return (
		<label
			className={clsx(
				"relative mb-2 flex cursor-pointer flex-row items-center justify-start rounded border border-neutral-400 px-3 py-2",
				"hover:border hover:border-neutral-500",
				{ "border border-neutral-500": selected, "pointer-events-none hover:border-neutral-400": disabled },
				className,
			)}
		>
			<input
				type="radio"
				{...field}
				onChange={handleChange}
				value={value}
				checked={selected}
				className="rounded-full border-neutral-300 text-neutral-600 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 focus:ring-offset-0"
			/>
			<span className="ml-2 block w-full">{children}</span>
		</label>
	);
};
