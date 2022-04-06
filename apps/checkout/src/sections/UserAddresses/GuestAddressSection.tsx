import { CountryCode } from "@graphql";
import React, { useState } from "react";
import { AddressFormData } from "./types";
import { UserAddressForm } from "./UserAddressForm";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";

interface GuestAddressSectionProps {
  onSubmit: (address: AddressFormData) => void;
  address: AddressFormData;
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
      <UserAddressForm
        onSave={handleSave}
        countryCode={selectedCountryCode}
        defaultValues={address}
      />
    </UserAddressSectionContainer>
  );
};
