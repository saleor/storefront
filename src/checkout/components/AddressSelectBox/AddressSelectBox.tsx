import React from "react";
import { addressSelectBoxLabels, addressSelectBoxMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { SelectBox, type SelectBoxProps } from "@/checkout/components/SelectBox";
import { Button } from "@/checkout/components/Button";
import { Address } from "@/checkout/components/Address";
import { type AddressFragment } from "@/checkout/graphql";
import { type AddressField } from "@/checkout/components/AddressForm/types";

interface AddressSelectBoxProps<TFieldName extends string>
	extends Omit<SelectBoxProps<TFieldName>, "children"> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	address: Partial<Record<AddressField, any>>;
	onEdit: () => void;
	unavailable: boolean;
}

export const AddressSelectBox = <TFieldName extends string>({
	address,
	onEdit,
	unavailable,
	...rest
}: AddressSelectBoxProps<TFieldName>) => {
	const formatMessage = useFormattedMessages();

	return (
		<SelectBox {...rest} disabled={unavailable}>
			<div className="flex w-full flex-row justify-between">
				<Address address={address as AddressFragment}>
					{unavailable && (
						<p className="font-xs my-1">{formatMessage(addressSelectBoxMessages.cantShipToAddress)}</p>
					)}
				</Address>
				<div>
					<Button
						variant="tertiary"
						onClick={(event) => {
							event.stopPropagation();
							onEdit();
						}}
						ariaLabel={formatMessage(addressSelectBoxMessages.editAddress)}
						className="pointer-events-auto absolute right-4"
						label={formatMessage(addressSelectBoxLabels.editAddress)}
					/>
				</div>
			</div>
		</SelectBox>
	);
};
