import React from "react";
import { Address, AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import {
  useCountrySelect,
  UseCountrySelectProps,
} from "@/checkout-storefront/hooks/useErrors/useCountrySelect";

interface GuestAddressSectionProps
  extends UseErrors<AddressFormData>,
    Pick<UseCountrySelectProps, "selectedCountryCode" | "checkAddressAvailability"> {
  onSubmit: (address: AddressFormData) => void;
  address: Address;
  title: string;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  selectedCountryCode,
  checkAddressAvailability,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(address);

  const countrySelectProps = useCountrySelect({
    autoSelect: !addressFormData?.countryCode && !selectedCountryCode,
    selectedCountryCode: addressFormData?.countryCode || selectedCountryCode,
    checkAddressAvailability,
  });

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, autoSave: true });

  return (
    <AddressForm
      autoSave
      title={title}
      onSubmit={handleSave}
      defaultValues={addressFormData}
      {...errorProps}
      {...countrySelectProps}
    />
  );
};
