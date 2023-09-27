import React from "react";
import { Select } from "@/checkout/src/components/Select";
import { type CountryCode } from "@/checkout/src/graphql";
import { countries as allCountries } from "@/checkout/src/lib/consts/countries";
import { createGetCountryNames } from "@/checkout/src/lib/utils/locale";

interface CountrySelectProps {
	only?: CountryCode[];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only = [] }) => {
	const getCountryName = createGetCountryNames();

	const countriesToMap = only.length ? only : allCountries;

	const countryOptions = countriesToMap.map((countryCode) => ({
		value: countryCode,
		label: getCountryName(countryCode),
	}));

	return (
		<Select
			name="countryCode"
			classNames={{ container: "flex-1 inline-block !w-auto" }}
			options={countryOptions}
			autoComplete="countryCode"
		/>
	);
};
