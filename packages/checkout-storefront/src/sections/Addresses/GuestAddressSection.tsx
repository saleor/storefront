import React from "react";
import { Address, AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";

interface GuestAddressSectionProps extends UseErrors<AddressFormData> {
  onSubmit: (address: AddressFormData) => void;
  title: string;
  defaultAddress: Address;
  checkAddressAvailability: boolean;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  title,
  checkAddressAvailability,
  defaultAddress,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(defaultAddress);

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, autoSave: true });

  return (
    <AddressForm
      autoSave
      title={title}
      onSubmit={handleSave}
      defaultValues={addressFormData}
      checkAddressAvailability={checkAddressAvailability}
      {...errorProps}
    />
  );
};
