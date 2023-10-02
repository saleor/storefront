import compact from "lodash-es/compact";
import React, { type PropsWithChildren } from "react";
import { type AddressFragment } from "@/checkout/graphql";

interface AddressProps {
	address: AddressFragment;
}

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({ address, children, ...textProps }) => {
	const name = `${address.firstName} ${address.lastName}`;

	const { phone, city, countryArea, postalCode, streetAddress1, country } = address;

	return (
		<div className="pointer-events-none flex flex-col">
			<p {...textProps} className="font-semibold">
				{name}
			</p>
			<p {...textProps}>{phone}</p>
			<p {...textProps}>{compact([streetAddress1, city, postalCode]).join(", ")}</p>
			<p {...textProps}>{compact([countryArea, country.country]).join(", ")}</p>
			{children}
		</div>
	);
};
