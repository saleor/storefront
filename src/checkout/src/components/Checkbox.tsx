import React from "react";
import { useField } from "formik";
import { Checkbox as UiKitCheckbox, type ClassNames } from "@/checkout/ui-kit";
import { useFormContext } from "@/checkout/src/hooks/useForm";

interface CheckboxProps<TName extends string> {
	name: TName;
	label: string;
	classNames: ClassNames<"container">;
}

export const Checkbox = <TName extends string>({ name, label }: CheckboxProps<TName>) => {
	const { handleChange } = useFormContext<Record<TName, string>>();
	const [field, { value }] = useField<boolean>(name);

	return (
		<UiKitCheckbox
			{...field}
			value={field.value as unknown as string}
			label={label}
			name={name}
			checked={value}
			onChange={(event) => {
				handleChange({ ...event, target: { ...event.target, name, value: !value } });
			}}
		/>
	);
};
