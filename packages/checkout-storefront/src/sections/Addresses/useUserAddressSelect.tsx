import { AddressFragment } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { getById } from "@/checkout-storefront/lib/utils";
import { useEffect, useRef, useState } from "react";
import { UserAddressFormData } from "./types";
import { isMatchingAddress } from "./utils";

export interface UseUserAddressSelectProps {
  defaultAddress?: AddressFragment | null;
  addresses: AddressFragment[];
  onAddressSelect: (data: UserAddressFormData) => void;
}

interface UseUserAddressSelect {
  selectedAddress?: AddressFragment;
  selectedAddressId?: string;
  setSelectedAddressId: (id: string) => void;
}

export const useUserAddressSelect = ({
  defaultAddress,
  onAddressSelect,
  addresses,
}: UseUserAddressSelectProps): UseUserAddressSelect => {
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id);

  const selectedAddressIdRef = useRef<string>();

  const selectedAddress = addresses.find(getById(selectedAddressId));

  useEffect(() => {
    if (
      selectedAddressId &&
      selectedAddressId !== selectedAddressIdRef.current &&
      selectedAddress &&
      !isMatchingAddress(selectedAddress, defaultAddress)
    ) {
      onAddressSelect(selectedAddress as unknown as UserAddressFormData);
      selectedAddressIdRef.current = selectedAddressId;
    }
  }, [selectedAddressId, selectedAddress]);

  useEffect(() => {
    const matchingAddressInAddresses = addresses.find((address) =>
      isMatchingAddress(address, defaultAddress)
    );

    if (matchingAddressInAddresses) {
      setSelectedAddressId(matchingAddressInAddresses.id);
      return;
    }

    const selectedAddressInAddresses = addresses.find(getById(selectedAddressId));

    if (selectedAddressInAddresses) {
      setSelectedAddressId(selectedAddressInAddresses.id);
    }
  }, [defaultAddress, selectedAddressId]);

  return {
    selectedAddress,
    selectedAddressId,
    setSelectedAddressId,
  };
};
