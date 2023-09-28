import React from "react";
import { Select as UiKitSelect, type SelectProps as UiKitSelectProps } from "@/checkout/ui-kit";
import { useField } from "@/checkout/src/hooks/useForm/useField";

interface SelectProps<TName extends string, TData extends string>
	extends Pick<UiKitSelectProps<TData>, "options" | "classNames" | "placeholder" | "autoComplete"> {
	name: TName;
}

export const Select = <TName extends string, TData extends string>({
	name,
	...rest
}: SelectProps<TName, TData>) => {
	const fieldProps = useField(name);

	return <UiKitSelect {...fieldProps} {...rest} />;
};
