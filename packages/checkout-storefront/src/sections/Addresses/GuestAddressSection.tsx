import { AddressFragment } from "@/checkout-storefront/graphql";
import React from "react";
import { AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressFormDataFromAddress } from "./utils";
import { useCountrySelect } from "@/checkout-storefront/providers/CountrySelectProvider";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";

interface GuestAddressSectionProps extends UseErrors<AddressFormData> {
  onSubmit: (address: AddressFormData) => void;
  address: AddressFragment;
  title: string;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  ...errorProps
}) => {
  const { countryCode } = useCountrySelect();

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, countryCode });

  return (
    <UserAddressSectionContainer title={title} displayCountrySelect>
      <AddressForm
        onSave={handleSave}
        defaultValues={getAddressFormDataFromAddress(address)}
        {...errorProps}
      />
    </UserAddressSectionContainer>
  );
};
