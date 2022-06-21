import { AddressFragment } from "@/checkout/graphql";
import React from "react";
import { AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressFormDataFromAddress } from "./utils";
import { ErrorScope, useErrors } from "@/checkout/providers/ErrorsProvider";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";

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
  const { countryCode } = useCountrySelect();

  const handleSave = (address: AddressFormData) =>
    onSubmit({ ...address, countryCode });

  return (
    <UserAddressSectionContainer title={title} displayCountrySelect>
      <AddressForm
        onSave={handleSave}
        defaultValues={getAddressFormDataFromAddress(address)}
        errorScope={errorScope}
      />
    </UserAddressSectionContainer>
  );
};
