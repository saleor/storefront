import React from "react";
import { Select } from "@/checkout/components/Select";
import { type CountryCode } from "@/checkout/graphql";
import { countries as allCountries } from "@/checkout/lib/consts/countries";
import { getCountryName } from "@/checkout/lib/utils/locale";

interface CountrySelectProps {
	only?: CountryCode[];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only = [] }) => {
	const countriesToMap = only.length ? only : allCountries;

	const countryOptions = countriesToMap.map((countryCode) => ({
		value: countryCode,
		label: getCountryName(countryCode),
	}));

	return (
		<label className="flex flex-col">
			<span className="text-xs text-neutral-700">Country</span>
			<Select name="countryCode" options={countryOptions} autoComplete="countryCode" />
		</label>
	);
};
