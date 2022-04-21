import { AddressFragment, CountryCode } from "@/graphql";
import React, { useState } from "react";
import { AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressFormDataFromAddress } from "./utils";

interface GuestAddressSectionProps {
  onSubmit: (address: AddressFormData) => void;
  address: AddressFragment;
  title: string;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryCode>("PL");

  const handleSave = (address: AddressFormData) =>
    onSubmit({ ...address, countryCode: selectedCountryCode });

  return (
    <UserAddressSectionContainer
      title={title}
      displayCountrySelect
      selectedCountryCode={selectedCountryCode}
      onCountrySelect={setSelectedCountryCode}
    >
      <AddressForm
        onSave={handleSave}
        countryCode={selectedCountryCode}
        defaultValues={getAddressFormDataFromAddress(address)}
      />
    </UserAddressSectionContainer>
  );
};
