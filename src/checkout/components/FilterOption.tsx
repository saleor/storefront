"use client";

import { type ChangeEventHandler } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Filter } from "@/repositories/product/types";

export const FilterOption = ({ options, name }: Filter) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());

		params.set(name, value);

		return params.toString();
	};

	const handleChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
		const qs = createQueryString(evt.target.name, evt.target.value);
		router.push(pathname + "?" + qs);
	};

	return (
		<fieldset key={name} className={"grid"}>
			<label>{name}</label>
			<select name={name} onChange={handleChange}>
				{options?.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</fieldset>
	);
};
