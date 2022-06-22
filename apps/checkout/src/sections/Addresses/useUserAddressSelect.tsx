import { AddressFragment, AddressTypeEnum } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { getById } from "@/checkout/lib/utils";
import { useEffect, useRef, useState } from "react";
import { UserAddressFormData } from "./types";
import { isMatchingAddress } from "./utils";

export interface UseUserAddressSelectProps {
  defaultAddressId?: string;
  addresses: AddressFragment[];
  type: AddressTypeEnum;
  onAddressSelect: (data: UserAddressFormData) => void;
}

interface UseUserAddressSelect {
  selectedAddress?: AddressFragment;
  selectedAddressId?: string;
  setSelectedAddressId: (id: string) => void;
}

export const useUserAddressSelect = ({
  type,
  defaultAddressId,
  onAddressSelect,
  addresses,
}: UseUserAddressSelectProps): UseUserAddressSelect => {
  const { checkout } = useCheckout();

  const addressToWatch =
    type === "SHIPPING" ? checkout?.shippingAddress : checkout?.billingAddress;

  const [selectedAddressId, setSelectedAddressId] = useState(
    addressToWatch?.id || defaultAddressId
  );

  const selectedAddress = addresses.find(getById(selectedAddressId));

  const selectedAddressRef = useRef<AddressFragment>();

  useEffect(() => {
    const matchingAddress = addresses.find(isMatchingAddress(addressToWatch));

    selectedAddressRef.current = matchingAddress;
    setSelectedAddressId(matchingAddress?.id);
  }, [addressToWatch]);

  useEffect(() => {
    if (selectedAddress && selectedAddress !== selectedAddressRef.current) {
      onAddressSelect(selectedAddress as unknown as UserAddressFormData);
      selectedAddressRef.current = selectedAddress;
    }
  }, [selectedAddressId]);

  return {
    selectedAddress,
    selectedAddressId,
    setSelectedAddressId,
  };
};
