import React from "react";
import { Select } from "@/checkout/components/Select";
import { type CountryCode } from "@/checkout/graphql";
import { countries as allCountries } from "@/checkout/lib/consts/countries";
import { createGetCountryNames } from "@/checkout/lib/utils/locale";

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

	return <Select name="countryCode" options={countryOptions} autoComplete="countryCode" />;
};
