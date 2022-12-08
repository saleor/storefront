import { Address, AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useCheckout } from "@/checkout-storefront/hooks";
import { getAddressFormDataFromAddress, isMatchingAddress } from "@/checkout-storefront/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSetBillingSameAsShippingProps {
  handleSubmit: (address: AddressFormData) => void;
}

export const useSetBillingSameAsShipping = ({ handleSubmit }: UseSetBillingSameAsShippingProps) => {
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress } = checkout;

  const [passDefaultFormDataAddress, setPassDefaultFormDataAddress] = useState<boolean>(
    !!billingAddress
  );

  const hasBillingSameAsShipping = isMatchingAddress(shippingAddress, billingAddress);

  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState<boolean>(
    checkout?.isShippingRequired ? !billingAddress || hasBillingSameAsShipping : false
  );
  const isBillingSameAsShippingRef = useRef<boolean>(isBillingSameAsShipping);
  const shippingAddressRef = useRef<Address>(shippingAddress);

  const setBillingSameAsShipping = useCallback(async () => {
    if (!hasBillingSameAsShipping && shippingAddress) {
      void handleSubmit({
        ...getAddressFormDataFromAddress(shippingAddress),
        autoSave: true,
      });
    }
  }, [handleSubmit, hasBillingSameAsShipping, shippingAddress]);

  useEffect(() => {
    const billingSetDifferentThanShipping =
      !isBillingSameAsShipping && isBillingSameAsShippingRef.current;

    if (billingSetDifferentThanShipping) {
      setPassDefaultFormDataAddress(false);
      isBillingSameAsShippingRef.current = isBillingSameAsShipping;
    }
  }, [isBillingSameAsShipping]);

  useEffect(() => {
    if (!isBillingSameAsShipping) {
      return;
    }

    const billingSetSameAsShipping = isBillingSameAsShipping && !isBillingSameAsShippingRef.current;

    const hasShippingAddressChanged =
      shippingAddress && shippingAddress !== shippingAddressRef.current;

    if (hasShippingAddressChanged || billingSetSameAsShipping) {
      void setBillingSameAsShipping();
      shippingAddressRef.current = shippingAddress;
      isBillingSameAsShippingRef.current = isBillingSameAsShipping;
      return;
    }
  }, [shippingAddress, isBillingSameAsShipping, setBillingSameAsShipping]);

  return { isBillingSameAsShipping, setIsBillingSameAsShipping, passDefaultFormDataAddress };
};
