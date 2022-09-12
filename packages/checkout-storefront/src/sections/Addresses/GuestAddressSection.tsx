import React, { useEffect } from "react";
import { Address, AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { emptyFormData, getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { getLocalizationDataFromUrl } from "@/checkout-storefront/lib/utils";

interface GuestAddressSectionProps extends UseErrors<AddressFormData> {
  onSubmit: (address: AddressFormData) => void;
  address: Address;
  title: string;
  defaultAddress: Address;
  checkAddressAvailability: boolean;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  checkAddressAvailability,
  defaultAddress,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(address);

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, autoSave: true });

  return (
    <AddressForm
      autoSave
      title={title}
      onSubmit={handleSave}
      defaultValues={addressFormData}
      {...errorProps}
    />
  );
};
