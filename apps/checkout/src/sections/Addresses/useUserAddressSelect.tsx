import { AddressFragment, AddressTypeEnum } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { getById } from "@/checkout/lib/utils";
import { useEffect, useState } from "react";
import { isMatchingAddress } from "./utils";

export interface UseUserAddressSelectProps {
  defaultAddressId?: string;
  addresses: AddressFragment[];
  type: AddressTypeEnum;
}

interface UseUserAddressSelect {
  selectedAddress?: AddressFragment;
  selectedAddressId?: string;
  setSelectedAddressId: (id: string) => void;
}

export const useUserAddressSelect = ({
  type,
  defaultAddressId,
  addresses,
}: UseUserAddressSelectProps): UseUserAddressSelect => {
  const { checkout } = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);

  const selectedAddress = addresses.find(getById(selectedAddressId));

  const addressToWatch =
    type === "SHIPPING" ? checkout?.shippingAddress : checkout?.billingAddress;

  useEffect(() => {
    const matchingAddress = addresses.find(isMatchingAddress(addressToWatch));

    setSelectedAddressId(matchingAddress?.id);
  }, [addressToWatch]);

  return {
    selectedAddress,
    selectedAddressId,
    setSelectedAddressId,
  };
};
