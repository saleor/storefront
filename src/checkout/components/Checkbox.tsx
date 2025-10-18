import { useField } from "formik";
import { useFormContext } from "@/checkout/hooks/useForm";

interface CheckboxProps<TName extends string> {
	name: TName;
	label: string;
}

export const Checkbox = <TName extends string>({ name, label }: CheckboxProps<TName>) => {
	const { handleChange } = useFormContext<Record<TName, string>>();
	const [field, { value }] = useField<boolean>(name);

	return (
		<label className="inline-flex items-center gap-x-2 text-base-100">
			<input
				{...field}
				value={field.value as unknown as string}
				name={name}
				checked={value}
				onChange={(event) => {
					handleChange({ ...event, target: { ...event.target, name, value: !value } });
				}}
				type="checkbox"
				className="rounded border-base-700 bg-base-950 text-accent-500 shadow-sm checked:border-accent-500 checked:bg-accent-500 focus:border-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-black"
			/>
			<span className="text-white">{label}</span>
		</label>
	);
};
