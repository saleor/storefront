import clsx from "clsx";
import React from "react";

import { Spinner } from "@/components";
import {
  AddressDetailsFragment,
  CheckoutError,
  CountryCode,
  useUserAddressesQuery,
} from "@/saleor/api";

import { AddressFormData } from "./AddressForm";

interface ChoosePredefinedAddressProps {
  updateAddressMutation: (address: AddressFormData) => Promise<CheckoutError[]>;
}

export const ChoosePredefinedAddress = ({
  updateAddressMutation,
}: ChoosePredefinedAddressProps) => {
  const { loading, error, data } = useUserAddressesQuery();
  const [chosenPredefinedAddress, setChosenPredefinedAddress] =
    React.useState<AddressDetailsFragment | null>();

  if (loading) {
    return <Spinner />;
  }

  if (error) return <p>Error : {error.message}</p>;

  let addresses = data?.me?.addresses || [];

  const onChoosePredefinedAddress = (address: AddressDetailsFragment) => {
    setChosenPredefinedAddress(address);
    updateAddressMutation({
      firstName: address?.firstName,
      lastName: address?.lastName,
      phone: address?.phone || "",
      country: CountryCode.Pl,
      streetAddress1: address.streetAddress1,
      city: address.city,
      postalCode: address.postalCode,
    });
  };

  return (
    <div className="grid grid-cols-2 mb-2">
      {addresses.length > 0 &&
        addresses.map((address) => {
          return (
            <div
              onClick={() => {
                return address && onChoosePredefinedAddress(address);
              }}
              className={clsx(
                "border-2 p-3 mr-2 rounded-md",
                address?.id === chosenPredefinedAddress?.id && "border-blue-500"
              )}
              key={address?.id}
            >
              <p>
                {address?.firstName} {address?.lastName}
              </p>
              <p className="text-gray-600 text-sm">{address?.streetAddress1}</p>
              <p className="text-gray-600 text-sm">
                {address?.postalCode} {address?.city},{" "}
                {address?.country.country}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default ChoosePredefinedAddress;
