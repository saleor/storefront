import clsx from "clsx";
import React from "react";

import { Spinner } from "@/components";
import { AddressDetailsFragment, CheckoutError, useCurrentUserAddressesQuery } from "@/saleor/api";

import { AddressFormData } from "./AddressForm";

interface SavedAddressSelectionListProps {
  updateAddressMutation: (address: AddressFormData) => Promise<CheckoutError[]>;
}

export function SavedAddressSelectionList({
  updateAddressMutation,
}: SavedAddressSelectionListProps) {
  const { loading, error, data } = useCurrentUserAddressesQuery();
  const [selectedSavedAddress, setSelectedSavedAddress] =
    React.useState<AddressDetailsFragment | null>();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error :{error.message}</p>;
  }

  const addresses = data?.me?.addresses || [];

  if (addresses.length === 0) return null;

  const onSelectSavedAddress = async (address: AddressDetailsFragment) => {
    setSelectedSavedAddress(address);

    // @todo handle errors
    const _errors = await updateAddressMutation({
      firstName: address?.firstName,
      lastName: address?.lastName,
      phone: address?.phone || "",
      country: "PL",
      streetAddress1: address.streetAddress1,
      city: address.city,
      postalCode: address.postalCode,
    });
  };

  return (
    <div className="grid grid-cols-2 mb-2">
      {addresses.map((address) => (
        <div
          role="radio"
          aria-checked={address?.id === selectedSavedAddress?.id}
          tabIndex={-1}
          onClick={() => address && onSelectSavedAddress(address)}
          onKeyDown={(e) => {
            if (address && e.key === "Enter") {
              return onSelectSavedAddress(address);
            }
          }}
          className={clsx(
            "border-2 p-3 mr-2 rounded-md",
            address?.id === selectedSavedAddress?.id && "border-blue-500"
          )}
          key={address?.id}
        >
          <p>{`${address?.firstName} ${address?.lastName}`}</p>
          <p className="text-gray-600 text-sm">{address?.streetAddress1}</p>
          <p className="text-gray-600 text-sm">
            {`${address?.postalCode} ${address?.city}, ${address?.country.country}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SavedAddressSelectionList;
