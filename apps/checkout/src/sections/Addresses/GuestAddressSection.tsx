import { AddressFragment, CountryCode } from "@/graphql";
import React, { useState } from "react";
import { AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressFormDataFromAddress } from "./utils";
import { ErrorScope, useErrors } from "@/providers/ErrorsProvider";

interface GuestAddressSectionProps {
  onSubmit: (address: AddressFormData) => void;
  address: AddressFragment;
  title: string;
  errorScope: ErrorScope;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  errorScope,
}) => {
  const errorProps = useErrors(errorScope);
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
        {...errorProps}
      />
    </UserAddressSectionContainer>
  );
};
