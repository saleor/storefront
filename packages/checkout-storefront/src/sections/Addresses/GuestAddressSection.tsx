import React, { useEffect } from "react";
import { Address, AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { emptyFormData, getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import {
  useCountrySelect,
  UseCountrySelectProps,
} from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { getLocalizationDataFromUrl } from "@/checkout-storefront/lib/utils";

interface GuestAddressSectionProps
  extends UseErrors<AddressFormData>,
    Pick<UseCountrySelectProps, "selectedCountryCode" | "checkAddressAvailability"> {
  onSubmit: (address: AddressFormData) => void;
  address: Address;
  title: string;
  defaultAddress: Address;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  selectedCountryCode,
  checkAddressAvailability,
  defaultAddress,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(address);

  const countrySelectProps = useCountrySelect({
    autoSelect: !addressFormData?.countryCode && !selectedCountryCode,
    selectedCountryCode: addressFormData?.countryCode || selectedCountryCode,
    checkAddressAvailability,
  });

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, autoSave: true });

  const handleAutoSetShippingCountry = () => {
    if (!address && !defaultAddress) {
      void onSubmit({
        ...emptyFormData,
        autoSave: true,
        countryCode: getLocalizationDataFromUrl().country.code,
      });
    }
  };

  useEffect(handleAutoSetShippingCountry, [address?.id]);

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
