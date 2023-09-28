import {
	type ChangeEvent,
	type ForwardedRef,
	forwardRef,
	type ReactNode,
	type SelectHTMLAttributes,
	useState,
} from "react";
import clsx from "clsx";

import { ChevronDownIcon } from "../icons";
import { type ClassNames } from "..";

const PLACEHOLDER_KEY = "placeholder";

export interface Option<TData extends string = string> {
	label: string | ReactNode;
	value: TData;
	disabled?: boolean;
	icon?: string | ReactNode;
	[key: string]: unknown;
}

export type SelectOnChangeHandler<TData extends string = string> = (value: TData) => void;

export interface SelectProps<TData extends string = string> extends SelectHTMLAttributes<HTMLSelectElement> {
	onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
	options: Option<TData>[];
	classNames?: ClassNames<"container">;
}

const SelectComponent = <TData extends string = string>(
	{ options, classNames, placeholder = "", onChange, ...rest }: SelectProps<TData>,
	ref: ForwardedRef<HTMLSelectElement>,
) => {
	const [showPlaceholder, setShowPlaceholder] = useState(!!placeholder);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		if ((event.target as HTMLSelectElement).value === PLACEHOLDER_KEY) {
			return;
		}

		setShowPlaceholder(false);
		onChange(event);
	};

	return (
		<div className={clsx("relative inline-block w-full min-w-[200px]", classNames?.container)}>
			<select
				{...rest}
				onChange={handleChange}
				ref={ref}
				className="h-10 w-full cursor-pointer appearance-none rounded border border-slate-600 px-3 py-2 pr-12 text-base"
			>
				{showPlaceholder && (
					<option disabled value="">
						{placeholder}
					</option>
				)}
				{options.map(({ label, value, disabled = false }) => (
					<option value={value} disabled={disabled} key={label?.toString() + "_" + value}>
						{label}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute right-2 top-2 border-l border-slate-400 pl-2">
				<ChevronDownIcon />
			</div>
		</div>
	);
};

export const Select = forwardRef(SelectComponent);
