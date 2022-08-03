import { AddressFragment } from "@/checkout-storefront/graphql";
import React from "react";
import { AddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import {
  useCountrySelect,
  UseCountrySelectProps,
} from "@/checkout-storefront/hooks/useErrors/useCountrySelect";

interface GuestAddressSectionProps
  extends UseErrors<AddressFormData>,
    Pick<UseCountrySelectProps, "selectedCountryCode"> {
  onSubmit: (address: AddressFormData) => void;
  address?: AddressFragment;
  title: string;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  address,
  title,
  selectedCountryCode,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(address);

  const countrySelectProps = useCountrySelect({
    autoSelect: !addressFormData?.countryCode && !selectedCountryCode,
    selectedCountryCode: addressFormData?.countryCode || selectedCountryCode,
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
